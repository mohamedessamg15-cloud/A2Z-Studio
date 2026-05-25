const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'freelance-os-secret-96-xp-luna';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error('Error opening database', err);
    else {
        console.log('Connected to SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS crm_clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                client TEXT,
                project TEXT,
                status TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS user_settings (
                user_id INTEGER PRIMARY KEY,
                desktop_theme TEXT,
                notepad_text TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`);
        });
    }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Auth API
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Error hashing password' });
        
        db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            // Initialize settings
            db.run('INSERT INTO user_settings (user_id, desktop_theme, notepad_text) VALUES (?, ?, ?)', [this.lastID, 'bliss', ''], (e) => {
                const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
                res.json({ token, username });
            });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'User not found' });

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result) return res.status(401).json({ error: 'Incorrect password' });

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
            res.json({ token, username: user.username });
        });
    });
});

// CRM API
app.get('/api/crm', authenticateToken, (req, res) => {
    db.all('SELECT id, client, project, status FROM crm_clients WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/crm', authenticateToken, (req, res) => {
    const { client, project, status } = req.body;
    db.run('INSERT INTO crm_clients (user_id, client, project, status) VALUES (?, ?, ?, ?)', [req.user.id, client, project, status], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, client, project, status });
    });
});

app.put('/api/crm/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    db.run('UPDATE crm_clients SET status = ? WHERE id = ? AND user_id = ?', [status, req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/crm/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM crm_clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Settings API
app.get('/api/settings', authenticateToken, (req, res) => {
    db.get('SELECT desktop_theme, notepad_text FROM user_settings WHERE user_id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || { desktop_theme: 'bliss', notepad_text: '' });
    });
});

app.post('/api/settings', authenticateToken, (req, res) => {
    const { desktop_theme, notepad_text } = req.body;
    db.run(`INSERT INTO user_settings (user_id, desktop_theme, notepad_text) VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET desktop_theme=excluded.desktop_theme, notepad_text=excluded.notepad_text`,
    [req.user.id, desktop_theme, notepad_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/settings/theme', authenticateToken, (req, res) => {
    const { theme } = req.body;
    db.run('UPDATE user_settings SET desktop_theme = ? WHERE user_id = ?', [theme, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/settings/notepad', authenticateToken, (req, res) => {
    const { text } = req.body;
    db.run('UPDATE user_settings SET notepad_text = ? WHERE user_id = ?', [text, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});


// AI API
app.post('/api/ai', async (req, res) => {
    const { prompt, fileParts = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const parts = [{ text: prompt }, ...fileParts];
    const body = { contents: [{ role: "user", parts: parts }] };

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const errText = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${errText}`);
        }
        const data = await resp.json();
        res.json(data);
    } catch (e) {
        console.error('AI Error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Fallback to index.html for SPA (though we are mainly using query params/hashes, good practice)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
