import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from '../config/db.js';
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'DSAFlow API' }));
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

const start = async () => {
  try {
    await connectDB();

    const listen = (port) => {
      const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is busy, trying ${port + 1}...`);
          server.close(() => listen(port + 1));
          return;
        }

        console.error('Failed to start server:', error.message);
        process.exit(1);
      });
    };

    listen(PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
