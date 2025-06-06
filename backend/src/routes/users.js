import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const JWT_SECRET = 'your_secret_key'; // 🔐 replace with env var in production

const db = new sqlite3.Database(path.join(__dirname, '..', 'events.db'));

// Register a user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, password_hash],
        function (err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });

            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
            res.json({ token, user: { id: this.lastID, email } });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email } });
    });
});

export default router;