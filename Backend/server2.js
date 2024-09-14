const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'Prakhar'; 

app.use(cors());
app.use(bodyParser.json());


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });
        db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User created' });
        });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!match) return res.status(401).json({ message: 'Invalid credentials' });
            const token = jwt.sign({ id: user.id }, SECRET_KEY);
            res.json({ token });
        });
    });
});


app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});


app.get('/employees', authenticateToken, (req, res) => {
    db.all('SELECT * FROM Employees LIMIT 10', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/employees', authenticateToken, (req, res) => {
    const { firstName, lastName, position, department } = req.body;
    db.run('INSERT INTO Employees (firstName, lastName, position, department) VALUES (?, ?, ?, ?)', [firstName, lastName, position, department], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Employee added' });
    });
});


app.get('/search', authenticateToken, (req, res) => {
    const query = req.query.q;
    db.all('SELECT * FROM Employees WHERE firstName LIKE ? OR lastName LIKE ? LIMIT 10', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
