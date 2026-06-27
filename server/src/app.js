import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import profileRoutes        from './routes/profile/routes.js';
import sectionRoutes        from './routes/section/routes.js';
import contactRoutes        from './routes/contact/routes.js';
import projectRoutes        from './routes/project/routes.js';
import askRoutes            from './routes/ask/routes.js';
import timelineRoutes       from './routes/timeline/routes.js';
import notebookRoutes       from './routes/notebook/routes.js';
import systemDesignRoutes   from './routes/system-design/routes.js';
import achievementsRoutes   from './routes/achievements/routes.js';
import codingProfilesRoutes from './routes/coding-profiles/routes.js';
import githubRoutes         from './routes/github/routes.js';
import reviewRoutes         from './routes/review/routes.js';
import adminRoutes          from './routes/admin/routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(helmet({ contentSecurityPolicy: isProduction ? undefined : false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/profile',         profileRoutes);
app.use('/api/sections',        sectionRoutes);
app.use('/api/contact',         contactRoutes);
app.use('/api/projects',        projectRoutes);
app.use('/api/ask',             askRoutes);
app.use('/api/timeline',        timelineRoutes);
app.use('/api/notebook',        notebookRoutes);
app.use('/api/system-design',   systemDesignRoutes);
app.use('/api/achievements',    achievementsRoutes);
app.use('/api/coding-profiles', codingProfilesRoutes);
app.use('/api/github',          githubRoutes);
app.use('/api/reviews',         reviewRoutes);
app.use('/api/admin',           adminRoutes);

if (isProduction) {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
