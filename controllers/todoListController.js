const mongoose = require('mongoose');
const TaskModel = require('../models/TaskModel');

const view_tasks_by_user_id = async (req, res) => {
    try {
        const { userId } = req.params;

        const tasks = await TaskModel.find({ user: userId });

        if (!tasks || tasks.length === 0) {
            return res.status(200).json([]); 
        }

        res.json(tasks); 
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Failed to fetch tasks.');
    }
};

const view_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        const task = await TaskModel.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch task', details: err.message });
    }
};

const create_new_task_for_user = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, status } = req.body;

        const newTask = new TaskModel({ name, status, user: userId });
        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Failed to create task', details: err.message });
    }
};

const update_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, user: userId },
            req.body,
            { new: true }
        );
        
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task', details: err.message });
    }
};

const searchTasks = async (req, res) => {
    const searchQuery = req.query.query?.trim() || '';
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    if (!searchQuery) {
        return res.json({ tasks: [] });
    }

    try {
        const regex = new RegExp(searchQuery, 'i');
        const tasks = await TaskModel.find({
            user: userId,
            name: { $regex: regex }
        });
        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
    }
};


const delete_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        const task = await TaskModel.findOneAndDelete({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task', details: err.message });
    }
};

const delete_all_task_by_status_for_user = async (req,res) => {
    try {
        const { userId } = req.params;

        const task = await TaskModel.deleteMany({ user: userId });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task', details: err.message });
    }
}

module.exports = {
    view_tasks_by_user_id,
    view_task_by_id_for_user,
    create_new_task_for_user,
    update_task_by_id_for_user,
    searchTasks,
    delete_task_by_id_for_user,
    delete_all_task_by_status_for_user
};
