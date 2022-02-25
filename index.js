const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns")
const YAML = require('yaml')
const fs = require('fs')

const file = fs.readFileSync('./config.yml', 'utf8')
const config = YAML.parse(file)

async function send(msg) {
  const client = new SNSClient(config);
  const input = {
    Message: msg,
    TopicArn: config.topicArn,
  }
  const command = new PublishCommand(input);
  return await client.send(command)
}

async function main() {
  send("nodeTest 2")
}

main()