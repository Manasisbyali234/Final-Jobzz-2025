const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Import Routes
const publicRoutes = require('./routes/public');
const candidateRoutes = require('./routes/candidate');
const employerRoutes = require('./routes/employer');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Note: Static file serving removed - all files now stored as Base64 in database

// API Routes
app.use('/api/public', publicRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', require('./routes/notifications'));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tale Job Portal API is running' });
});

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Tale Job Portal API running on port ${PORT}`);
});