import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { createServer } from "http";


const app = express();
const server = createServer(app);

dotenv.config()


app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());



app.get("/", (request: Request, response: Response) => {
  response.send("Welcome to Perishable Inventory's Backend Server. 👋");
});

const { PORT } = process.env
server.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});

export default app;
