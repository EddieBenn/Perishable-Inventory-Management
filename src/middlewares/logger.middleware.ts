import { createLogger, format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export default logger;
