const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = "mongodb+srv://jaswanthuchiha69:pjss28@cluster0.q2kzo.mongodb.net/authDB";

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Database connection error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format!" });

    if (phone.length !== 10 || isNaN(phone))
        return res.status(400).json({ error: "Invalid phone number!" });

    if (password.length < 8)
        return res.status(400).json({ error: "Password must be at least 8 characters long!" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            res.status(400).json({ error: `${field} already exists!` });
        } else {
            res.status(500).json({ error: "Server error!" });
        }
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

        res.status(200).json({ message: "Login successful!", user });
    } catch (err) {
        res.status(500).json({ error: "Server error!" });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Send user details to the client upon successful login
        return res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
