import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-edulms';

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
  
  const insertModule = db.prepare('INSERT INTO modules (course_id, title, order_position) VALUES (?, ?, ?)');
  const m1 = insertModule.run(c1.lastInsertRowid, 'Module 1: Foundations', 1);
  const m2 = insertModule.run(c1.lastInsertRowid, 'Module 2: History', 2);

  const insertVideo = db.prepare('INSERT INTO videos (module_id, title, youtube_id, description, order_position) VALUES (?, ?, ?, ?, ?)');
  insertVideo.run(m1.lastInsertRowid, 'What is Islam?', 'jNQXAC9IVRw', 'An introduction to the core beliefs.', 1);
  insertVideo.run(m1.lastInsertRowid, 'The Five Pillars', 'jNQXAC9IVRw', 'Detailed explanation of the five pillars.', 2);
  insertVideo.run(m2.lastInsertRowid, 'Early Islamic History', 'jNQXAC9IVRw', 'History of the early days.', 1);
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
    const validRole = (role === 'admin' || role === 'user') ? role : 'user';

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
