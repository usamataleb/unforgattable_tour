import express from "express";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routers
import authRouter from './src/routers/auth.js';
import imageRouter from './src/routers/images.js';
import carouselRouter from './src/routers/carousel.js';

// Middleware
import { limiter, uploadLimiter } from './src/middleware/rateLimit.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { securityMiddleware } from './src/middleware/security.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security middleware
securityMiddleware(app);

// Rate limiting
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));

// Static file serving - FIXED CONFIGURATION
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/auth", authRouter);
app.use("/images", imageRouter);
app.use("/carousel", carouselRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
