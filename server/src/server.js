import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

import { connectDB } from '../config/db.js';
import { getRedis } from '../config/redis.js';
import { reindexAllProblems } from '../config/solr.js';
import { seedProblems } from './utils/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.warn('SMTP is not configured. Signup verification codes will only be logged in development.');
}

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
