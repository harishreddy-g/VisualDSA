import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from '../config/db.js';
import { getRedis } from '../config/redis.js';
import { reindexAllProblems } from '../config/solr.js';
import { seedProblems } from './utils/seed.js';
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'DSAFlow API',
  redis: Boolean(process.env.REDIS_URL),
  solr: Boolean(process.env.SOLR_URL),
  openai: Boolean(process.env.OPENAI_API_KEY),
}));

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/problems/:slug/discussions', discussionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const start = async () => {
  try {
    await connectDB();
    await getRedis();

    const problems = await seedProblems();
    await reindexAllProblems(problems);

    const listen = (port) => {
      const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          server.close(() => {
            const nextPort = Number(port) + 1;
            console.warn(`Port ${port} is busy, trying ${nextPort}...`);
            listen(nextPort);
          });
          return;
        }

        console.error('Failed to start server:', error.message);
        process.exit(1);
      });
    };

    listen(Number(PORT));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
