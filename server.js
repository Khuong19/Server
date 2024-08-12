const express = require('express');
const mongoose = require('mongoose');



// Initialize express app
const app = express();

// MongoDB connection
const db = "mongodb+srv://khuongnhathuy:dacren-sUjsov-byfku3@todolist.jh99xt7.mongodb.net/todoList";
mongoose.connect(db)
    .then(() => console.log('Connected to database successfully'))
    .catch((err) => console.error('Database connection failed:', err));

// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// Import routes
const authRoutes = require('./routes/authRoutes');
const todoListRoutes = require('./routes/todoListRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', todoListRoutes);

// Start server
const port = 3000;
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
