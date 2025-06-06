import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM events ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (!row) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(row);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get user's participations
router.get('/participations/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    // Verify that the requesting user matches the userId parameter
    if (req.user.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Unauthorized to view these participations' });
    }

    try {
        const rows = await db.all(
            `SELECT ep.*, e.title as event_title
             FROM event_participants ep
             JOIN events e ON ep.event_id = e.id
             WHERE ep.user_id = ?
             ORDER BY ep.created_at DESC`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching participations:', err);
        res.status(500).json({ error: err.message });
    }
});

// Register for an event
router.post('/:id/participate', async (req, res) => {
    const { team_name, team_members, additional_info } = req.body;
    const event_id = req.params.id;
    const user_id = req.user.userId; // From auth middleware

    if (!team_name || !team_members) {
        return res.status(400).json({ error: 'Team name and members are required' });
    }

    try {
        // Check if user already registered for this event
        const existing = await db.get(
            'SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?',
            [event_id, user_id]
        );

        if (existing) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        // Register for the event
        const result = await db.run(
            `INSERT INTO event_participants (event_id, user_id, team_name, team_members, additional_info)
             VALUES (?, ?, ?, ?, ?)`,
            [event_id, user_id, team_name, team_members, additional_info]
        );

        res.status(201).json({
            message: 'Successfully registered for event',
            id: result.lastID
        });
    } catch (err) {
        console.error('Error registering for event:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get participants for an event
router.get('/:id/participants', async (req, res) => {
    try {
        const rows = await db.all(
            `SELECT ep.*, u.email 
             FROM event_participants ep
             JOIN users u ON ep.user_id = u.id
             WHERE ep.event_id = ?
             ORDER BY ep.created_at DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching participants:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;