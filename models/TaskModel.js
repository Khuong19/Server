const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'ongoing', 'completed'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' }, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Task', taskSchema);
