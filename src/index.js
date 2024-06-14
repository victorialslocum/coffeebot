const app = require('./app');
const { schedulePairing } = require('./controllers/pairingController');
const { checkInUsers } = require('./controllers/messageController');
const logger = require('./utils/logger');

// Initialize the bot and start the server
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    logger.info('⚡️ Bolt app is running!');

    // Schedule the weekly pairing task
    schedulePairing();

    // Schedule the weekly check-in task
    checkInUsers();
  } catch (error) {
    logger.error('Unable to start the app', error);
  }
})();
