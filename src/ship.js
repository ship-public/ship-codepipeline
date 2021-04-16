function generateRunEventsMessage(org, key,
                                  projectName, projectId, workflowName, workflowId,
                                  runId, activity, conclusion, dateTime,
                                  runNumber, providerRunWebpageUrl,
                                  commitId, commitMessage) {
    return {
        provider: {
            type: 'AWS_CODE_PIPELINE',
            integration: {
                name: 'ship-codepipeline',
                // TODO - get from package JSON (will need including in artifact bundle, or alternative)
                version: '0.9.0'
            }
        },
        organization: {
            name: org,
            key
        },
        providerEventType: 'runEvents',
        content: {
            events: [{
                workflow: {projectName, projectId, workflowId, workflowName},
                run: {
                    id: runId,
                    activity, conclusion, dateTime,
                    runNumber, providerRunWebpageUrl
                },
                ...(commitId ? {
                            commits: [{
                                provider: 'GITHUB',
                                id: commitId,
                                message: commitMessage
                            }]
                        }
                        : {}
                )
            }]
        }
    }
}

exports.generateRunEventsMessage = generateRunEventsMessage