# Ship Plugin for AWS CodePipeline

Ship is currently under development. For more information see https://www.shipapp.io/ .

This is a plugin to publish AWS CodePipeline events to Ship.

## Prerequisites

* A Ship organization name - contact the Ship team for details
* A Ship API key
* A project name that will group all of your AWS CodePipelines in Ship. You can use "code-pipelines" to start, if 
  you wish.
* An AWS account using CodePipeline - there's no point in using this plugin otherwise!

## Installation

This plugin needs to be installed as a CloudFormation stack within each account where you run CodePipeline.

To install the plugin, run the included [deploy.sh](./deploy.sh) script. This script needs to be run on a 
Mac or Linux machine. Node, the AWS CLI, and the AWS SAM CLI all need to have been installed and configured.

The deploy script should be run in the form:

```json
./deploy.sh --ship-org=YOUR_SHIP_ORG --ship-key=YOUR_SHIP_KEY --ship-project-name YOUR_SHIP_PROJECT_NAME 
--cloudformation-bucket CLOUDFORMATION_BUCKET
```

where:

* `YOUR_SHIP_ORG` is your Ship organization name
* `YOUR_SHIP_KEY` is your Ship API key
* `YOUR_SHIP_PROJECT_NAME` is the project in Ship you wish to group your CodePipeline workflows under
* `CLOUDFORMATION_BUCKET` is an S3 bucket to be used as a temporary deployment artifact location by CloudFormation

There are also two optional parameters:

* `--stack-name=STACK_NAME` : by default, a CloudFormation stack named `ship-codepipeline` will be created. You can 
  change this name with the `--stack-name` parameter.
* `--api-url=API_URL` : only use this if directed to do so by the Ship team

Neither a region nor AWS account are specifiable with the deployment script, so the default region and account will 
be used from the shell you are running the deployment script from.

Check your CloudFormation console to make sure the plugin has installed successfully.

