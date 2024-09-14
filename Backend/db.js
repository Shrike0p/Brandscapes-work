const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.serialize(() => {
    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    // Create Employees table
    db.run(`
        CREATE TABLE IF NOT EXISTS Employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            position TEXT,
            department TEXT
        )
    `);

    // Load initial data if empty
    db.get("SELECT COUNT(*) as count FROM Employees", (err, row) => {
        if (row.count === 0) {
            // Load data from CSV file or manually
            // Assume data is loaded into Employees table here
        }
    });
});

module.exports = db;