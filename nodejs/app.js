const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const users = require('./mongo'); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/users', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.error("Error in connecting to database", err);
});

const db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to Database"));
db.once('open', () => console.log("Connected to database"));



app.get('/getUsers', async (req, res) => {
    try {
        const usersData = await users.find();
        res.json(usersData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { studentRollNo, studentPassword } = req.body;
        await users.create({ studentRollNo, studentPassword });
        console.log("Record Inserted Successfully");
        res.redirect('index.html');
    } catch (err) {
        console.error("Error in sign up", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/signin", async (req, res) => {
    try {
        const { studentRollNo, studentPassword } = req.body;
        const foundUser = await users.findOne({ studentRollNo });
        if (!foundUser) {
            return res.status(401).send("User Not Found. Please Sign Up.");
        }
        if (foundUser.studentPassword !== studentPassword) {
            return res.status(401).send("Incorrect password. Please try again.");
        }
        return res.redirect('signup.html');
    } catch (err) {
        console.error("Error in sign in", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, res) => {
    return res.redirect('index.html');
});

const port = 3004;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
