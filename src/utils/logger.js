import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug', // Changed to debug to get more detailed logs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata, null, 2)}`;
          }
          return msg;
        })
      )
    }),
    new winston.transports.File({ 
      filename: 'tick-listener.log',
      maxFiles: 5
    })
  ]
});

export default logger;