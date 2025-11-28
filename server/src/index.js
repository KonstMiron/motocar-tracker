import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import vehiclesRouter from './routes/vehicles.js';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);

app.use('/api/vehicles', vehiclesRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo error:', err.message);
    process.exit(1);
  });