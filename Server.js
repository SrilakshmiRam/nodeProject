const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'usersData.db');
let db = null;

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to initiate the database connection and start the server
const initiateAndStartDatabaseServer = async () => {
    try {
        // Open a connection to the SQLite database
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        // Start the server on port 3000
        app.listen(3000, () => {
            console.log('Backend server is running at http://localhost:3000/');
        });
    } catch (e) {
        console.error(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

// Call the function to start the server and connect to the database
initiateAndStartDatabaseServer();

// POST route to handle user creation
app.post('/users', async (req, res) => {
    try {
        // Check if userDetails exists in the request body
        if (!req.body || !req.body.userDetails) {
            return res.status(400).send('Invalid request format');
        }
        
        // Extract user details from the request body
        const { userDetails } = req.body;
        const { username, password } = userDetails;

        // SQL query to insert a new user into the database
        const insertQuery = `INSERT INTO user (username, password) VALUES (?, ?)`;
        await db.run(insertQuery, [username, password]);

        // Send a success response
        res.status(201).send('Data successfully inserted');
    } catch (error) {
        console.error('Error inserting data:', error.message);
        // Send an error response
        res.status(500).send('Internal Server Error');
    }
});


app.get("/userData/",async(req,res)=>{
    const userQuery=`select * from user;`
    const responseData=await db.all(userQuery)
    res.send(responseData)
})