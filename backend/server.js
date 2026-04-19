const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));

// Placeholder routes for remaining CRUD logic based on the Viva schema requirements
app.use('/api/campaigns', (req, res) => res.json({ msg: "Campaign routes hit" }));
app.use('/api/applications', (req, res) => res.json({ msg: "Applications route hit" }));
app.use('/api/donations', (req, res) => res.json({ msg: "Donations route hit" }));

// Basic Home API Check
app.get('/', (req, res) => res.send('Lokasamyoga API Running Successfully.'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`Connected successfully to MongoDB Database`);
    app.listen(PORT, () => console.log(`Server started perfectly on port ${PORT}`));
}).catch(err => {
    console.error("MongoDB Connection Failed:");
    console.error("Make sure your local MongoDB instance is running!");
    // Allows process to continue for demo structure logging purposes
});
