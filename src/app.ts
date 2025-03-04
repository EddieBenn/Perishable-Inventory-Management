import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { globalExceptionHandler } from './middlewares/error.middleware';
import winstonLogger, { loggerMiddleware } from './middlewares/logger.middleware';
import { testConnection } from './config/database';

const app = express();
const server = createServer(app);

dotenv.config();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(globalExceptionHandler);

testConnection();

app.get('/', (request: Request, response: Response) => {
  response.send("Welcome to Perishable Inventory's Backend Server. 👋");
});

const { PORT } = process.env;
server.listen(PORT, () => {
  winstonLogger.info(`Server running on Port ${PORT}`);
});

export default app;
