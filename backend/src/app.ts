import express from 'express';
import cors from 'cors'
import { config } from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorMiddleware);

export { app }
