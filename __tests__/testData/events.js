exports.succeededEvent = {
    'version': '0',
    'id': '12345678-1234-1234-1234-12345678901',
    'detail-type': 'CodePipeline Pipeline Execution State Change',
    'source': 'aws.codepipeline',
    'account': '111111111111',
    'time': '2021-04-11T21:18:31Z',
    'region': 'us-east-1',
    'resources': [
        'arn:aws:codepipeline:us-east-1:111111111111:codepipeline-test'
    ],
    'detail': {
        'pipeline': 'codepipeline-test',
        'execution-id': 'abcdef12-1234-1234-1234-12345678901',
        'state': 'SUCCEEDED',
        'version': 1
    }
}
