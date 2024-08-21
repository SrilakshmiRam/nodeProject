const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');

const app = express();

const dbPath = path.join(__dirname, 'usersData.db');
let db = null;

// Middleware to parse JSON request bodies and handle CORS
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Define routes
app.get('/users', (req, res) => {
  res.json({ users: ['user1', 'user2'] });
});

app.post('/users', async (req, res) => {
  try {
    const { userDetails } = req.body;
    if (!userDetails || !userDetails.name || !userDetails.password) {
      return res.status(400).send('Invalid request format');
    }

    const { name, password } = userDetails;
    // SQL query to insert a new user into the database
    const insertQuery = `INSERT INTO user (name, password) VALUES (?, ?)`;
    await db.run(insertQuery, [name, password]);

    res.status(201).send('Data successfully inserted');
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/userData/', async (req, res) => {
  try {
    const userQuery = `SELECT * FROM user;`;
    const responseData = await db.all(userQuery);
    res.json(responseData); // Using .json() to send JSON response
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Function to initiate the database connection and start the server
const initiateAndStartDatabaseServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log('Backend server is running at http://localhost:3000/');
    });
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// Start the server and connect to the database
initiateAndStartDatabaseServer();
