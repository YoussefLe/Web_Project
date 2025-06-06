DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Insert a test user
INSERT INTO users (email, password_hash) VALUES 
('student@example.com', '$2b$10$Z7J7S3z1k7W9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8');

-- Insert events
INSERT INTO events (title, description, date, time, location, category, user_id, image_url)
VALUES 
('INPT Annual Hackathon 2024', '48 hours of coding and creativity.', '2024-04-20', '09:00', 'INPT Campus', 'hackathon', 1, 'hackathon.jpg'),
('Retro Game Night', 'Classic arcade games and high scores.', '2024-03-15', '19:00', 'Game Room', 'gaming', 1, 'game.jpg'),
('VR Development Workshop', 'Build your first VR app with Unity.', '2024-03-28', '14:00', 'Lab 3', 'workshop', 1, 'workshop.jpg'),
('Board Games Tournament', 'Chess, Catan and more.', '2024-04-05', '16:00', 'Student Lounge', 'gaming', 1, 'board-games.jpg'),
('AI & Machine Learning Workshop', 'Intro to ML and AI.', '2024-04-12', '10:00', 'CS Lab', 'workshop', 1, 'ai-workshop.jpg');

