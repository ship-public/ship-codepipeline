#!/bin/bash

usage () {
   echo 'USAGE: deploy.sh --ship-org=YOUR_SHIP_ORG --ship-key=YOUR_SHIP_KEY --ship-project-name YOUR_SHIP_PROJECT_NAME --cloudformation-bucket CLOUDFORMATION_BUCKET'
   echo 'Optionally, also set the --api-url and/or --stack-name parameters'
   exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --ship-org=*)
      SHIP_ORG="${1#*=}"
      ;;
    --ship-key=*)
      SHIP_KEY="${1#*=}"
      ;;
    --ship-project-name=*)
      SHIP_PROJECT_NAME="${1#*=}"
      ;;
    --cloudformation-bucket=*)
      CLOUDFORMATION_BUCKET="${1#*=}"
      ;;
    --api-url=*)
      API_URL="${1#*=}"
      ;;
    --stack-name=*)
      STACK_NAME="${1#*=}"
      ;;
    *)
      usage
  esac
  shift
done

[ -z "$SHIP_ORG" ] && usage
[ -z "$SHIP_KEY" ] && usage
[ -z "$SHIP_PROJECT_NAME" ] && usage
[ -z "$CLOUDFORMATION_BUCKET" ] && usage
[ -z "$API_URL" ] && API_URL="https://api.backend.shipapp.io/provider/events"
[ -z "$STACK_NAME" ] && STACK_NAME="ship-codepipeline"

set -euo pipefail

echo "Building application bundle..."
echo
./build.sh

echo "Ship Org = $SHIP_ORG"
echo "Ship Key is set"
echo "Ship Project Name = $SHIP_PROJECT_NAME"
echo "API URL = $API_URL"
echo "Cloudformation Bucket = $CLOUDFORMATION_BUCKET"
echo "Stack name = $STACK_NAME"
echo

echo "Attempting to deploy"
echo

sam deploy \
    --template template.yaml \
    --stack-name "$STACK_NAME" \
    --s3-bucket "$CLOUDFORMATION_BUCKET" \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides ShipOrg="$SHIP_ORG" ShipKey="$SHIP_KEY" \
        ShipProjectName="$SHIP_PROJECT_NAME" ShipApiUrl="$API_URL"
