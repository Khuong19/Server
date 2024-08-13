const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, 
            trim: true, 
            lowercase: true, 
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'] 
        }
    },
    {
        timestamps: true 
    }
);

// Create and export the User model
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
