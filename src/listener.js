const axios = require('axios')
const { generateRunEventsMessage } = require('./ship')
const { safeGet } = require('./util/collections')
const { safeGetAll } = require('./util/collections')
const { GetPipelineExecutionCommand } = require('@aws-sdk/client-codepipeline')
const { CodePipelineClient } = require('@aws-sdk/client-codepipeline')

const codePipelineClient = new CodePipelineClient({})

const shipOrg = process.env.SHIP_ORG
const shipKey = process.env.SHIP_KEY
const projectName = process.env.SHIP_PROJECT_NAME
const shipAPIURL = process.env.SHIP_API_URL

async function handler(event) {
    if (!shipOrg)
        throw new Error('SHIP_ORG environment variable not set')
    if (!shipKey)
        throw new Error('SHIP_KEY environment variable not set')
    if (!projectName)
        throw new Error('SHIP_PROJECT_NAME environment variable not set')
    if (!shipAPIURL)
        throw new Error('SHIP_API_URL environment variable not set')

    console.log('Received new Code Pipeline event')
    console.log(JSON.stringify(event))

    let shipMessage
    try {
        shipMessage = await generateShipMessage(event)
    } catch (e) {
        console.error(`Unable to generate ship message. Error is: ${e.message}`)
        console.error('This is likely not a recoverable error, so returning from Lambda function successfully to avoid retry')
        return
    }

    await postToShip(shipMessage)
}

async function generateShipMessage(event) {
    // TODO check pipeline structure to see what type the source is (and think of multiple source artifacts?)
    const { time, region } = safeGetAll(event, [['time'], ['region']]),
        { pipeline, state } = safeGetAll(event.detail, [['pipeline'], ['state']]),
        executionId = safeGet(event.detail, ['execution-id']),
        // There's a version on the event, but that's the version of the pipeline itself, not of the run
        // This value is not linearly increasing, unfortunately
        runNumber = `${executionId.slice(0, 4)}`,
        [activity, conclusion] = calcActivityAndConclusion(state),
        runUrl = generateUrl(pipeline, executionId, region),
        [commitId, commitMessage] = await getCommitDetails(pipeline, executionId)

    return generateRunEventsMessage(shipOrg, shipKey,
        projectName, projectName, pipeline, pipeline,
        executionId, activity, conclusion, time,
        runNumber, runUrl, commitId, commitMessage
    )
}

function calcActivityAndConclusion(state) {
    const isInProgress = state === 'STARTED' || state === 'RESUMED' || state === 'SUPERSEDED'
    if (isInProgress) {
        return ['RunInProgress', 'NotYetComplete']
    }
    // state can also be 'CANCELED', but ship doesn't currently have such a conclusion
    return ['RunCompleted', state === 'SUCCEEDED' ? 'Success' : 'Failure']
}

function generateUrl(pipeline, executionId, region) {
    return `https://console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline}/executions/${executionId}/timeline?region=${region}`
}

// Commit details aren't on the CloudWatch event, so call the CodePipeline service to get them
// We are currently assuming that Github commit details are available. In future we should
// make this more intelligent and/or add configuration
async function getCommitDetails(pipeline, executionId) {
    const pipelineExecutionCommand = new GetPipelineExecutionCommand(
        { pipelineName: pipeline, pipelineExecutionId: executionId }
    )

    // This might throw an error, which will be caught by the calling function
    const codePipelineResponse = await codePipelineClient.send(pipelineExecutionCommand)
    console.log('Got following execution details from CodePipeline:')
    console.log(JSON.stringify(codePipelineResponse))

    // There's also a 'revisionUrl', which we can add as a commit URL at some point
    const sourceRevision = codePipelineResponse.pipelineExecution.artifactRevisions
        .find(({ name }) => name === 'SourceCode' || name === 'SourceArtifact')

    // "SourceArtifact" contains encoded JSON in .revisionSummary, so for now, just ignore
    return sourceRevision
        ? [sourceRevision.revisionId, null]
        : [null, null]
}

async function postToShip(shipMessage) {
    console.log(`Attempting to post message to Ship API at ${shipAPIURL}`)
    const response = await axios.post(shipAPIURL, shipMessage, { headers: { 'Content-type': 'application/json' } })
    // TODO - check response code
    console.log(`Ship responded with ${response.status} ${response.data}`)
}

exports.handler = handler
