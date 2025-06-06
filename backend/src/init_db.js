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
                title: 'Mobile App Development Challenge',
                description: 'Two day mobile app development competition. Create innovative solutions for real-world problems. Flutter and React Native workshops included.',
                date: '2024-05-20',
                time: '09:00',
                location: 'INPT Innovation Space',
                image_url: 'mobile-dev.jpg',
                category: 'Hackathon'
            },
            {
                title: 'Cybersecurity Summit 2024',
                description: 'Learn about the latest trends in cybersecurity, ethical hacking, and network security. Features guest speakers from leading security firms and hands-on penetration testing workshops.',
                date: '2024-05-10',
                time: '10:00',
                location: 'INPT Conference Center',
                image_url: 'cybersecurity.jpg',
                category: 'Conference'
            },
            {
                title: 'DevOps & Agile Practices Seminar',
                description: 'Learn modern DevOps tools and agile methodologies. Featuring workshops on Docker, Kubernetes, and CI/CD pipelines.',
                date: '2024-04-28',
                time: '10:00',
                location: 'INPT Room 105',
                image_url: 'devops.jpg',
                category: 'Seminar'
            },
            {
                title: 'Web3 & Blockchain Workshop',
                description: 'Deep dive into blockchain technology, smart contracts, and decentralized applications. Hands-on experience with Ethereum and Solidity.',
                date: '2024-06-15',
                time: '14:00',
                location: 'INPT Digital Lab',
                image_url: 'blockchain.jpg',
                category: 'Workshop'
            },
            {
                title: 'AI & Machine Learning Bootcamp',
                description: 'Intensive three-day bootcamp covering deep learning, computer vision, and natural language processing. Build real AI projects with PyTorch and TensorFlow.',
                date: '2024-07-01',
                time: '09:00',
                location: 'INPT AI Center',
                image_url: 'ai-ml.jpg',
                category: 'Bootcamp'
            },
            {
                title: 'Cloud Computing Conference',
                description: 'Explore cloud architecture, serverless computing, and microservices. AWS, Azure, and GCP certification preparation workshops included.',
                date: '2024-06-05',
                time: '10:00',
                location: 'INPT Auditorium',
                image_url: 'cloud.jpg',
                category: 'Conference'
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