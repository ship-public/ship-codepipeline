# AWS CodePipeline support for Ship

Welcome to Ship's [AWS CodePipeline](https://aws.amazon.com/codepipeline/) support! To learn how Ship can help you with your Code
Pipeline workflows, please see [our website](https://www.shipapp.io/integrations/aws-codepipeline).

Ship's support for CodePipeline is implemented as a small service that runs in the same AWS account as your CodePipeline
workflows.

## Step 1: Add the Ship App to your GitHub Organization

This can be done from our [GitHub Marketplace listing](https://github.com/marketplace/shipapp-io). Ship needs to
integrate with Github for user authentication, and it will also map Github commit details to CodePipeline runs.

## Step 2: Get your Ship + CodePipeline API Key

Email [hello@shipapp.io](mailto:hello@shipapp.io) to get yours!

## Step 3: Have permissions to install the Ship service to the same account(s) where CodePipeline runs

This will be typically be admin-level permissions, but otherwise you'll need permissions to create Lambda functions, IAM
roles, and log groups.

## Step 4: Choose a project name per account

Ship will group all the CodePipelines in an account into one Ship "project", which you'll need a name for. If you only 
have
CodePipeline running in one account you can use "code-pipelines" to start, if you wish.

## Step 5: Installation

This plugin needs to be installed as a CloudFormation stack within each account where you run CodePipeline. You can
install the stack from a local development machine, or from it's own automated workflow - it's up to you.

To install the plugin, checkout this repo, and run the included [deploy.sh](./deploy.sh) script. This script needs to be
run on a Mac or Linux machine. Node, the AWS CLI, and the AWS SAM CLI all need to have been installed and configured.

The deploy script should be run with the form:

```json
./deploy.sh --ship-org=YOUR_SHIP_ORG --ship-key=YOUR_SHIP_KEY --ship-project-name YOUR_SHIP_PROJECT_NAME
--cloudformation-bucket CLOUDFORMATION_BUCKET
```

where:

* `YOUR_SHIP_ORG` is your Ship organization name (the same as your Github organization name)
* `YOUR_SHIP_KEY` is your Ship API key
* `YOUR_SHIP_PROJECT_NAME` is the project in Ship you wish to group your CodePipeline workflows under
* `CLOUDFORMATION_BUCKET` is an S3 bucket to be used as a temporary deployment artifact location by CloudFormation

There are also two optional parameters:

* `--stack-name=STACK_NAME` : by default, a CloudFormation stack named `ship-codepipeline` will be created. You can
  change this name with the `--stack-name` parameter.
* `--api-url=API_URL` : only use this if directed to do so by the Ship team

Neither a region nor AWS account are specifiable with the deployment script, so the default region and account will be
used from the shell you are running the deployment script from.

Check your CloudFormation console to make sure the plugin has installed successfully.

Once installed you should see events in Ship the next time your CodePipeline workflows run!

## Support

If you need any help please drop us a line at [support@shipapp.io](mailto:support@shipapp.io) .

Happy Shipping!
