import { db } from './db.js';

async function initializeDatabase() {
    try {
        // Drop existing tables
        await db.exec('DROP TABLE IF EXISTS event_participants');
        await db.exec('DROP TABLE IF EXISTS events');
        await db.exec('DROP TABLE IF EXISTS users');
        console.log('Dropped existing tables');

        // Create users table
        await db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created');

        // Create events table
        await db.exec(`
            CREATE TABLE events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                location TEXT NOT NULL,
                image_url TEXT,
                category TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Events table created');

        // Create event_participants table
        await db.exec(`
            CREATE TABLE event_participants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                team_name TEXT NOT NULL,
                team_members TEXT NOT NULL,
                additional_info TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(event_id) REFERENCES events(id),
                FOREIGN KEY(user_id) REFERENCES users(id),
                UNIQUE(event_id, user_id)
            )
        `);
        console.log('Event participants table created');

        // Insert sample events
        const sampleEvents = [
            {
                title: 'INPT Annual Hackathon 2024',
                description: 'Join the brightest minds for 48 hours of coding, creativity, and collaboration. Compete, network, and innovate with fellow students and industry experts.',
                date: '2024-04-20',
                time: '09:00',
                location: 'Main Campus, Building A',
                image_url: 'hackathon.jpg',
                category: 'Technology'
            },
            {
                title: 'Game Development Workshop',
                description: 'Learn to create your own video games using Unity engine. Perfect for beginners!',
                date: '2024-03-15',
                time: '14:00',
                location: 'Computer Lab 2',
                image_url: 'game.jpg',
                category: 'Workshop'
            },
            {
                title: 'AI Research Symposium',
                description: 'Join leading researchers in artificial intelligence for a day of presentations and discussions.',
                date: '2024-05-10',
                time: '10:00',
                location: 'Conference Hall',
                image_url: 'workshop.jpg',
                category: 'Academic'
            },
            {
                title: 'Board Games Tournament',
                description: 'Compete in various board games including Chess, Go, and modern strategy games.',
                date: '2024-03-30',
                time: '16:00',
                location: 'Student Center',
                image_url: 'games.jpg',
                category: 'Social'
            }
        ];

        for (const event of sampleEvents) {
            await db.run(`
                INSERT INTO events (title, description, date, time, location, image_url, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [event.title, event.description, event.date, event.time, event.location, event.image_url, event.category]);
        }
        console.log('Sample events inserted');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase().then(() => {
    console.log('Database setup complete');
    process.exit(0);
}); 