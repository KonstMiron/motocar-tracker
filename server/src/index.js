import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';


import authRouter from './routes/auth.js';
import vehiclesRouter from './routes/vehicles.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app = express();

// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL // Add your Render frontend URL here
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/export', exportRoutes);

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