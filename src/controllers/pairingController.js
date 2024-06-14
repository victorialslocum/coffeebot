const { scheduleJob } = require('node-schedule');
const { pairUsers, notifyUsers } = require('../services/slackService');

const schedulePairing = () => {
  scheduleJob('0 9 * * 1', async () => {
    const pairs = await pairUsers();
    await notifyUsers(pairs);
  });
};

module.exports = { schedulePairing };
