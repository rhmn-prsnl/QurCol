import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-edulms';
const ADMIN_EMAIL = 'admin@edulms.com';

// Setup Nodemailer transporter
// In a real production app, you would use real SMTP credentials from environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'margarita.roob@ethereal.email', // Replace with real credentials or use ethereal for testing
    pass: '1234567890'
  }
});

// Helper function to send email (mocked for preview environment)
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    console.log(`[Email Service] Sending email to: ${to}`);
    console.log(`[Email Service] Subject: ${subject}`);
    console.log(`[Email Service] Body: ${text}`);
    // We are just logging to console for this preview environment to avoid SMTP errors
    // await transporter.sendMail({ from: '"EduLMS" <noreply@edulms.com>', to, subject, text });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Initialize Database
const db = new Database('edulms.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level TEXT,
    instructor TEXT,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT NOT NULL,
    order_position INTEGER,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    title TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    description TEXT,
    order_position INTEGER,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    course TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact TEXT NOT NULL,
    side TEXT NOT NULL,
    amount TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    youtube_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Admin User if not exists
const adminEmail = 'admin@edulms.com';
const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin', adminEmail, hashedPassword, 'super_admin');
}

// Seed some dummy data if courses are empty
const coursesCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
if (coursesCount.count === 0) {
  const insertCourse = db.prepare('INSERT INTO courses (title, description, category, level, instructor, thumbnail) VALUES (?, ?, ?, ?, ?, ?)');
  const c1 = insertCourse.run('Introduction to Islamic Studies', 'Learn the basics of Islamic history and theology.', 'Theology', 'Beginner', 'Dr. Ahmed', 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800');
  const c2 = insertCourse.run('Advanced Arabic Grammar', 'Master the intricacies of Arabic grammar.', 'Language', 'Advanced', 'Prof. Sarah', 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80&w=800');
  const c3 = insertCourse.run('Web Development Bootcamp', 'Learn full-stack web development from scratch.', 'Technology', 'Beginner', 'John Doe', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800');
  const c4 = insertCourse.run('Data Science Fundamentals', 'Introduction to data analysis and machine learning.', 'Technology', 'Intermediate', 'Jane Smith', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800');
  const c5 = insertCourse.run('UI/UX Design Masterclass', 'Design beautiful and functional user interfaces.', 'Design', 'Beginner', 'Alice Johnson', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800');
  
  const insertModule = db.prepare('INSERT INTO modules (course_id, title, order_position) VALUES (?, ?, ?)');
  const m1 = insertModule.run(c1.lastInsertRowid, 'Module 1: Foundations', 1);
  const m2 = insertModule.run(c1.lastInsertRowid, 'Module 2: History', 2);

  const insertVideo = db.prepare('INSERT INTO videos (module_id, title, youtube_id, description, order_position) VALUES (?, ?, ?, ?, ?)');
  insertVideo.run(m1.lastInsertRowid, 'What is Islam?', 'jNQXAC9IVRw', 'An introduction to the core beliefs.', 1);
  insertVideo.run(m1.lastInsertRowid, 'The Five Pillars', 'jNQXAC9IVRw', 'Detailed explanation of the five pillars.', 2);
  insertVideo.run(m2.lastInsertRowid, 'Early Islamic History', 'jNQXAC9IVRw', 'History of the early days.', 1);

  // Seed Inquiries
  const insertInquiry = db.prepare('INSERT INTO inquiries (name, email, phone, gender, course, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertInquiry.run('Alice Brown', 'alice@example.com', '+91 9876543210', 'female', 'web-dev', 'I want to know the schedule.', 'new');
  insertInquiry.run('Bob White', 'bob@example.com', '+91 9876543211', 'male', 'data-science', 'Is there a discount?', 'new');
  insertInquiry.run('Charlie Green', 'charlie@example.com', '+91 9876543212', 'male', 'ui-ux', 'Do I need prior experience?', 'read');
  insertInquiry.run('Diana Prince', 'diana@example.com', '+91 9876543213', 'female', 'mobile-dev', 'What is the duration?', 'new');
  insertInquiry.run('Evan Wright', 'evan@example.com', '+91 9876543214', 'male', 'other', 'General question about platform.', 'read');

  // Seed Contacts
  const insertContact = db.prepare('INSERT INTO contacts (name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)');
  insertContact.run('Frank Castle', 'frank@example.com', 'Login Issue', 'I cannot login to my account.', 'new');
  insertContact.run('Grace Lee', 'grace@example.com', 'Payment Failed', 'My card was charged but course not added.', 'new');
  insertContact.run('Hank Pym', 'hank@example.com', 'Partnership', 'We want to partner with you.', 'read');
  insertContact.run('Ivy Poison', 'ivy@example.com', 'Feedback', 'Great platform!', 'read');
  insertContact.run('Jack Sparrow', 'jack@example.com', 'Refund', 'I want a refund for my last purchase.', 'new');

  // Seed Donations
  const insertDonation = db.prepare('INSERT INTO donations (name, email, contact, side, amount, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertDonation.run('Karen Page', 'karen@example.com', '+91 9876543215', 'A', 'Variable', 'Keep up the good work!', 'new');
  insertDonation.run('Luke Cage', 'luke@example.com', '+91 9876543216', 'B', 'Variable', 'For the students.', 'read');
  insertDonation.run('Matt Murdock', 'matt@example.com', '+91 9876543217', 'A', 'Variable', '', 'new');
  insertDonation.run('Natasha Romanoff', 'natasha@example.com', '+91 9876543218', 'B', 'Variable', 'Happy to help.', 'read');
  insertDonation.run('Oliver Queen', 'oliver@example.com', '+91 9876543219', 'A', 'Variable', 'Great initiative.', 'new');

  // Seed Activities
  const insertActivity = db.prepare('INSERT INTO activities (title, date, description, thumbnail, youtube_link) VALUES (?, ?, ?, ?, ?)');
  insertActivity.run('Annual Tech Symposium', '2026-03-15', 'A gathering of tech enthusiasts.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80', '');
  insertActivity.run('Coding Bootcamp Kickoff', '2026-04-01', 'Start of our intensive coding bootcamp.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80', '');
  insertActivity.run('Design Thinking Workshop', '2026-04-15', 'Learn the principles of design thinking.', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80', '');
  insertActivity.run('AI in Education Seminar', '2026-05-01', 'Exploring the impact of AI on learning.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80', '');
  insertActivity.run('Alumni Meetup 2026', '2026-05-20', 'Networking event for our alumni.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', '');

  // Seed Events
  const insertEvent = db.prepare('INSERT INTO events (title, date, time, location, description, image) VALUES (?, ?, ?, ?, ?, ?)');
  insertEvent.run('Global Education Summit 2026', '2026-06-15', '10:00 AM EST', 'Virtual Event', 'Join us for the biggest education summit.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80');
  insertEvent.run('Web3 Developers Conference', '2026-07-10', '09:00 AM PST', 'San Francisco, CA', 'The future of decentralized web.', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80');
  insertEvent.run('EdTech Startup Pitch Day', '2026-08-05', '02:00 PM EST', 'New York, NY', 'Watch innovative startups pitch their ideas.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80');
  insertEvent.run('Women in Tech Panel', '2026-09-12', '11:00 AM GMT', 'Virtual Event', 'Inspiring stories from women leaders in tech.', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80');
  insertEvent.run('Open Source Contribution Hackathon', '2026-10-20', '08:00 AM EST', 'Virtual Event', 'Contribute to open source projects and win prizes.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') return res.sendStatus(403);
    next();
  };

  const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'super_admin') return res.sendStatus(403);
    next();
  };

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    res.json({ user });
  });

  // Public Courses
  app.get('/api/courses', (req, res) => {
    const courses = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    res.json(courses);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  });

  // Protected Course Content (Requires Login)
  app.get('/api/courses/:id/content', authenticateToken, (req: any, res) => {
    const courseId = req.params.id;
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_position ASC').all(courseId) as any[];
    for (const mod of modules) {
      mod.videos = db.prepare('SELECT id, title, youtube_id, description, order_position FROM videos WHERE module_id = ? ORDER BY order_position ASC').all(mod.id);
    }

    res.json({ course, modules });
  });

  // Enroll in course
  app.post('/api/courses/:id/enroll', authenticateToken, (req: any, res) => {
    try {
      db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Already enrolled or error' });
    }
  });

  app.get('/api/user/enrollments', authenticateToken, (req: any, res) => {
    const courses = db.prepare(`
      SELECT c.* FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = ?
    `).all(req.user.id);
    res.json(courses);
  });

  // User Profile Update
  app.put('/api/user/profile', authenticateToken, (req: any, res) => {
    const { name, password } = req.body;
    try {
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.prepare('UPDATE users SET name = ?, password = ? WHERE id = ?').run(name, hashedPassword, req.user.id);
      } else {
        db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Admin Routes
  app.get('/api/admin/badges', authenticateToken, requireAdmin, (req, res) => {
    const inquiries = (db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get() as any).count;
    const contacts = (db.prepare("SELECT COUNT(*) as count FROM contacts WHERE status = 'new'").get() as any).count;
    const donations = (db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'new'").get() as any).count;
    res.json({ inquiries, contacts, donations });
  });

  app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
    const users = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
    const courses = (db.prepare('SELECT COUNT(*) as count FROM courses').get() as any).count;
    const videos = (db.prepare('SELECT COUNT(*) as count FROM videos').get() as any).count;
    res.json({ users, courses, videos });
  });

  // Admin CRUD Courses
  app.post('/api/admin/courses', authenticateToken, requireAdmin, (req, res) => {
    const { title, description, category, level, instructor, thumbnail } = req.body;
    const result = db.prepare('INSERT INTO courses (title, description, category, level, instructor, thumbnail) VALUES (?, ?, ?, ?, ?, ?)').run(title, description, category, level, instructor, thumbnail);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/admin/courses/:id', authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Admin CRUD Modules
  app.post('/api/admin/modules', authenticateToken, requireAdmin, (req, res) => {
    const { course_id, title, order_position } = req.body;
    const result = db.prepare('INSERT INTO modules (course_id, title, order_position) VALUES (?, ?, ?)').run(course_id, title, order_position);
    res.json({ id: result.lastInsertRowid });
  });

  // Admin CRUD Videos
  app.post('/api/admin/videos', authenticateToken, requireAdmin, (req, res) => {
    const { module_id, title, youtube_id, description, order_position } = req.body;
    const result = db.prepare('INSERT INTO videos (module_id, title, youtube_id, description, order_position) VALUES (?, ?, ?, ?, ?)').run(module_id, title, youtube_id, description, order_position);
    res.json({ id: result.lastInsertRowid });
  });

  // Admin Users
  app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  });

  app.post('/api/admin/users', authenticateToken, requireAdmin, (req: any, res) => {
    const { name, email, password, role } = req.body;
    
    // Only super_admin can create other admins
    if (role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admin can create other admins' });
    }
    
    // Ensure role is valid
    const validRole = (role === 'admin' || role === 'user' || role === 'faculty') ? role : 'user';

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, hashedPassword, validRole);
      res.json({ id: result.lastInsertRowid, name, email, role: validRole });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Database error' });
      }
    }
  });

  // News
  app.get('/api/news', (req, res) => {
    const news = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
    res.json(news);
  });

  // Inquiries
  app.post('/api/inquiries', async (req, res) => {
    const { name, email, phone, gender, course, message } = req.body;
    db.prepare('INSERT INTO inquiries (name, email, phone, gender, course, message) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, phone, gender, course, message);
    
    // Send email to admin
    await sendEmail(ADMIN_EMAIL, 'New Course Inquiry Received', `You have received a new inquiry from ${name} (${email}) for the course: ${course}.\n\nMessage: ${message}`);
    
    // Send confirmation email to user
    await sendEmail(email, 'Inquiry Received - EduLMS', `Dear ${name},\n\nThank you for your inquiry regarding the ${course} course. We have received your message and will get back to you shortly.\n\nYour Message:\n${message}\n\nBest regards,\nEduLMS Team`);
    
    res.json({ success: true });
  });

  app.get('/api/admin/inquiries', authenticateToken, requireAdmin, (req, res) => {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json(inquiries);
  });

  app.put('/api/admin/inquiries/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Contacts
  app.post('/api/contacts', async (req, res) => {
    const { name, email, subject, message } = req.body;
    db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
    
    // Send email to admin
    await sendEmail(ADMIN_EMAIL, `New Contact Form Submission: ${subject}`, `You have received a new contact message from ${name} (${email}).\n\nSubject: ${subject}\nMessage: ${message}`);
    
    // Send confirmation email to user
    await sendEmail(email, 'Contact Form Received - EduLMS', `Dear ${name},\n\nThank you for contacting us. We have received your message regarding "${subject}" and will get back to you shortly.\n\nYour Message:\n${message}\n\nBest regards,\nEduLMS Team`);
    
    res.json({ success: true });
  });

  app.get('/api/admin/contacts', authenticateToken, requireAdmin, (req, res) => {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  });

  app.put('/api/admin/contacts/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Donations
  app.post('/api/donations', async (req, res) => {
    const { name, email, contact, side, amount, message } = req.body;
    db.prepare('INSERT INTO donations (name, email, contact, side, amount, message) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, contact, side, amount, message);
    
    // Send email to admin
    await sendEmail(ADMIN_EMAIL, 'New Donation Received', `You have received a new donation from ${name} (${email}).\n\nSide: Option ${side}\nAmount: ${amount}\nMessage: ${message}`);
    
    // Send confirmation email to user
    await sendEmail(email, 'Donation Received - EduLMS', `Dear ${name},\n\nThank you for your generous donation (Option ${side}). We deeply appreciate your support.\n\nYour Message:\n${message}\n\nBest regards,\nEduLMS Team`);
    
    res.json({ success: true });
  });

  app.get('/api/admin/donations', authenticateToken, requireAdmin, (req, res) => {
    const donations = db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all();
    res.json(donations);
  });

  app.put('/api/admin/donations/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Activities
  app.get('/api/activities', (req, res) => {
    const activities = db.prepare('SELECT * FROM activities ORDER BY date DESC').all();
    res.json(activities);
  });

  app.post('/api/admin/activities', authenticateToken, requireAdmin, (req, res) => {
    const { title, date, description, thumbnail, youtube_link } = req.body;
    const result = db.prepare('INSERT INTO activities (title, date, description, thumbnail, youtube_link) VALUES (?, ?, ?, ?, ?)').run(title, date, description, thumbnail, youtube_link);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/admin/activities/:id', authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Events
  app.get('/api/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events ORDER BY date DESC').all();
    res.json(events);
  });

  app.post('/api/admin/events', authenticateToken, requireAdmin, (req, res) => {
    const { title, date, time, location, description, image } = req.body;
    const result = db.prepare('INSERT INTO events (title, date, time, location, description, image) VALUES (?, ?, ?, ?, ?, ?)').run(title, date, time, location, description, image);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
