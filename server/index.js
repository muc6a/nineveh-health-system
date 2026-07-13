import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import estRoutes from './routes/estRoutes.js';
import evalRoutes from './routes/evalRoutes.js';
import closureRoutes from './routes/closureRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/establishments', estRoutes);
app.use('/api/evaluations', evalRoutes);
app.use('/api/closures', closureRoutes);

// Basic health check route
app.get('/api/health', async (req, res) => {
  try {
    // Quick DB connection check
    const result = await db.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'success', 
      message: 'Server and Database are healthy!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Serve static frontend in production
if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, '../dist');

  app.use(express.static(distPath));

  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server (only if not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;
