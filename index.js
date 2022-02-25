const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns")
const YAML = require('yaml')
const fs = require('fs')
const axios = require('axios')

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

async function testTarget(url = config.targetUrl) {
  try {
    const res = await axios.get(url, {timeout: 5000})
    return res.status
  } catch (e) {
    return e.message
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  var lastStatus = 200

  while (true) {
    await sleep(config.interval * 1000)
    const status = await testTarget()
    console.log(`${Date()} - ${status}`)
    if (status !== lastStatus) {
      // if SNS throws then crash the process; run with PM2
      send(`Status changed to: ${status}`)
      lastStatus = status
    }
  }
}

main()