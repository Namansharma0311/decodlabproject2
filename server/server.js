/**
 * server.js
 * ------------------------------------------------------
 * Entry point for the Far & Few AI backend.
 * Sets up Express, security middleware, custom middleware,
 * static client serving, API routes, and error handling.
 * ------------------------------------------------------
 */

const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const logger = require('./middleware/logger');
const timestamp = require('./middleware/timestamp');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const destinationRoutes = require('./routes/destinationRoutes');
const packageRoutes = require('./routes/packageRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------- Security & Core Middleware ------------------------- */

app.use(
  helmet({
    contentSecurityPolicy: false, // relaxed for CDN-hosted GSAP/Three.js/Lenis in the demo client
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ------------------------- Rate Limiting ------------------------- */

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});
app.use('/api', apiLimiter);

/* ------------------------- Custom Middleware ------------------------- */

app.use(logger);
app.use(timestamp);

/* ------------------------- Static Client ------------------------- */

app.use(express.static(path.join(__dirname, '..', 'client')));

/* ------------------------- API Routes ------------------------- */

app.use('/api', destinationRoutes);
app.use('/api', packageRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', contactRoutes);
app.use('/api', bookingRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', reviewRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Far & Few AI API is healthy',
    timestamp: req.requestTime,
  });
});

/* ------------------------- Client Fallback (SPA) ------------------------- */

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

/* ------------------------- 404 + Error Handling ------------------------- */

app.use('/api', notFound);
app.use(errorHandler);

/* ------------------------- Start Server ------------------------- */

app.listen(PORT, () => {
  console.log(`\n✈️  Far & Few AI server running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
