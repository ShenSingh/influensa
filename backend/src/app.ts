import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Basic API route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Influensa API' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
