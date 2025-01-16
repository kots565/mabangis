const express = require("express");
const path = require("path");
const { Client } = require("pg");

const app = express();

const client = new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "passwordkosapostgresql",
    database: "expressAPI",
});

client.connect((err) => {
    if (err) {
        console.error(`Failed to connect to PostgreSQL: ${err.stack}`);
    } else {
        console.log("Connected to PostgreSQL successfully");
    }
});

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/members", (req, res) => {
    res.send("This is the /api/members endpoint. Use POST to add members.");
});

// route para mag insert ng data tangina
app.post("/api/members", async (req, res) => {
    const { username, email, mobile, password } = req.body;

    console.log("Request Body:", req.body);

    if (!username || !email || !mobile || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const query = `
            INSERT INTO members (username, email, mobile, password)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [username, email, mobile, password];
        console.log("Query Values:", values);

        const result = await client.query(query, values);

        res.status(201).json({
            message: "Member added successfully",
            member: result.rows[0],
        });
    } catch (err) {
        console.error(`Error inserting data: ${err.message}`);
        res.status(500).json({
            error: "An error occurred while adding the member."
        });
    }
});


// patakbohen ang serber
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});