import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { isMailConfigured } from '../config/mail.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'DSAFlow API',
  redis: Boolean(process.env.REDIS_URL),
  solr: Boolean(process.env.SOLR_URL),
  openai: Boolean(process.env.OPENAI_API_KEY),
  mail: isMailConfigured(),
}));

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/problems/:slug/discussions', discussionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;