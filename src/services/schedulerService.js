const { scheduleJob } = require('node-schedule');

const scheduleTask = (cron, task) => {
  scheduleJob(cron, task);
};

module.exports = { scheduleTask };
