import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Request Logger
app.use((req, res, next) => {
    console.log(`📡 Request: ${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/heart_angio_db')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// Basic health check route (only for non-production or API testing)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Heart Angiography API is running' });
});

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    // Determine directory paths for ES Modules
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const distPath = path.join(__dirname, '../dist');

    // Serve static files from the 'dist' directory
    app.use(express.static(distPath));

    // Handle React routing - use middleware for Express 5 compatibility
    app.use((req, res, next) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(distPath, 'index.html'));
        } else {
            next();
        }
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
