const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://lokasamyoga.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true
}));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/admin', require('./routes/admin'));

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
