const winston = require("winston");
require('dotenv').config();
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const MongoDB = require("winston-mongodb").MongoDB;
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDatabase = require("../config/db.js");

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const setupLogger = async () => {
  const dbConnection = await connectDatabase();
  const logger = createLogger({
    level: "info",
    format: combine(label({ label: "YourApp" }), timestamp(), logFormat),
    transports: [
      new transports.Console(),
      new MongoDB({
        db: dbConnection,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        collection: "logs",
      }),
    ],
  });
  return logger;
};

const logMiddleware = async (req, res, next) => {
  const logger = await setupLogger();
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
};
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
const secretKey = 'YourSuperSecretKeyHere1234567890';
module.exports = { logMiddleware, secretKey, store };
