import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Initialize express app
const app = express();

// Generate allowed origins for ports 3000-3010 and 8080
const allowedOrigins = [
    'http://localhost:8080',
    ...Array.from({ length: 11 }, (_, i) => `http://localhost:${3000 + i}`)
];

// Middleware
app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));
app.use(express.json());

// Static files
app.use(express.static(join(projectRoot, 'frontend')));
app.use('/assets', express.static(join(projectRoot, 'frontend', 'assets')));
app.use(express.static(join(__dirname, '..', 'public')));

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', authenticateToken, eventRoutes);

// Health check route
app.get('/api/health', (req, res) => res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbConnected: !!db
}));

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(join(projectRoot, 'frontend', 'index.html'));
});

// Function to check if a port is in use
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', () => resolve(true))
            .once('listening', () => {
                server.close();
                resolve(false);
            })
            .listen(port);
    });
}

// Start server with port conflict handling
async function startServer(initialPort) {
    let port = initialPort;
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const inUse = await isPortInUse(port);
        if (!inUse) {
            app.listen(port, () => {
                console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
                console.log(`Server URL: http://localhost:${port}`);
            });
            return;
        }
        port++;
    }

    console.error(`Unable to find an available port after ${maxAttempts} attempts`);
    process.exit(1);
}

// Start the server
const PORT = process.env.PORT || 3000;
startServer(PORT);
