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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Sample data
INSERT INTO users (email, password_hash) VALUES 
('student@example.com', '$2b$10$Z7J7S3z1k7W9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8');

-- Add sample user
INSERT INTO users (email, password_hash) VALUES 
('student@example.com', '$2b$10$Z7J7S3z1k7W9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8yY0UeQ0Lr6vW9Xq9Q8');

-- Add 6 sample events with different categories and dates
INSERT INTO events (title, description, date, time, location, category, user_id) VALUES
('Python Workshop', 'Learn Python basics with hands-on exercises', '2024-06-15', '14:00', 'Computer Science Building, Room 101', 'workshop', 1),
('Basketball Tournament', 'Annual inter-department basketball competition', '2024-06-18', '16:00', 'Main Sports Complex', 'sports', 1),
('Career Fair Prep', 'Get ready for the upcoming career fair with resume reviews', '2024-06-20', '10:00', 'Student Center, Room 205', 'academic', 1),
('Campus Movie Night', 'Outdoor screening of classic films with free popcorn', '2024-06-22', '19:30', 'Central Quadrangle', 'social', 1),
('AI Research Seminar', 'Latest developments in artificial intelligence research', '2024-06-25', '13:00', 'Engineering Building, Auditorium', 'academic', 1),
('Yoga on the Lawn', 'Relaxing yoga session for all skill levels', '2024-06-28', '08:00', 'East Campus Lawn', 'sports', 1);
