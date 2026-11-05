import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import weddingRoutes from './routes/weddingRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contributionRoutes from './routes/contributionRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import seatingRoutes from './routes/seatingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev
    }
  },
  credentials: true,
}));

// Request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Wedora API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route mountings
app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/weddings/:id/expenses', expenseRoutes);
app.use('/api/weddings/:id/payments', paymentRoutes);
app.use('/api/weddings/:id/contributions', contributionRoutes);
app.use('/api/weddings/:id/guests', guestRoutes);
app.use('/api/weddings/:id/vendors', vendorRoutes);
app.use('/api/weddings/:id/tasks', taskRoutes);
app.use('/api/weddings/:id/timeline', timelineRoutes);
app.use('/api/weddings/:id/tables', seatingRoutes);
app.use('/api/weddings/:id/analytics', analyticsRoutes);
app.use('/api/weddings/:id/reports', reportRoutes);
app.use('/api/invitations', invitationRoutes);

// Catch-all 404 for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found.` });
});

// Centralized error handler
app.use(errorHandler);

export default app;

