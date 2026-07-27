const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const log = (level, data) => {
  const message = {
    timestamp: getTimestamp(),
    level,
    ...data,
  };

  const logMessage = JSON.stringify(message);

  // Console output
  console.log(`[${level}] ${logMessage}`);

  // File output
  const logFile = path.join(logsDir, `${level}.log`);
  fs.appendFileSync(logFile, logMessage + '\n');
};

module.exports = {
  info: (data) => log('INFO', data),
  error: (data) => log('ERROR', data),
  debug: (data) => log('DEBUG', data),
  warn: (data) => log('WARN', data),
};
