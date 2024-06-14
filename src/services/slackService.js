const { WebClient } = require('@slack/web-api');
const logger = require('../utils/logger');

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to fetch users from a specific Slack channel
const fetchUsersFromChannel = async (channelId) => {
  try {
    const result = await slackClient.conversations.members({ channel: channelId });
    return result.members;
  } catch (error) {
    logger.error('Error fetching users from channel:', error);
    return [];
  }
};

// Function to pair users randomly
const pairUsers = async () => {
  const channelId = 'C06P433T48H'; // Replace with your Slack channel ID
  const users = await fetchUsersFromChannel(channelId);
  const shuffledUsers = users.sort(() => 0.5 - Math.random());
  const pairs = [];

  while (shuffledUsers.length >= 2) {
    pairs.push([shuffledUsers.pop(), shuffledUsers.pop()]);
  }

  if (shuffledUsers.length === 1) {
    pairs.push([shuffledUsers.pop()]);
  }

  return pairs;
};

// Function to notify paired users via DM
const notifyUsers = async (pairs) => {
  for (const pair of pairs) {
    for (const user of pair) {
      try {
        const result = await slackClient.conversations.open({
          users: pair.join(',')
        });

        const channelId = result.channel.id;

        await slackClient.chat.postMessage({
          channel: channelId,
          text: `You have been paired with <@${pair.find(u => u !== user)}>!`
        });
      } catch (error) {
        logger.error('Error notifying users:', error);
      }
    }
  }
};

// Function to check in with users
const checkInWithUsers = async () => {
  const pairs = await pairUsers(); // Fetch the pairs again if needed or store them in a database when pairing initially

  for (const pair of pairs) {
    for (const user of pair) {
      try {
        const result = await slackClient.conversations.open({
          users: user
        });

        const channelId = result.channel.id;

        await slackClient.chat.postMessage({
          channel: channelId,
          text: `Hi <@${user}>, just checking in! Did you have a chance to meet with <@${pair.find(u => u !== user)}> this week?`
        });
      } catch (error) {
        logger.error('Error checking in with users:', error);
      }
    }
  }
};

module.exports = { pairUsers, notifyUsers, checkInWithUsers };
