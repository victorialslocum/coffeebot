const { scheduleJob } = require('node-schedule');
const { checkInWithUsers } = require('../services/slackService');

const checkInUsers = () => {
  scheduleJob('0 17 * * 5', async () => {
    await checkInWithUsers();
  });
};

module.exports = { checkInUsers };
