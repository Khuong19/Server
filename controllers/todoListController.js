const TaskModel = require('../models/TaskModel');

// View all tasks for a specific user
const view_tasks_by_user_id = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await TaskModel.find({ user: userId });

        // Return an empty array if no tasks are found
        if (!tasks || tasks.length === 0) {
            return res.status(200).json([]); 
        }

        res.json(tasks); // Return the found tasks
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Failed to fetch tasks.');
    }
};




// View a specific task by ID for a specific user
const view_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const task = await TaskModel.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch task', details: err.message });
    }
}

// Create a new task for a specific user
const create_new_task_for_user = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, status } = req.body;

        // Create and save the new task
        const newTask = new TaskModel({ name, status, user: userId });
        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Failed to create task', details: err.message });
    }
};



// Update a specific task by ID for a specific user
const update_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, user: userId },  // Ensure correct field is used for user reference
            req.body,
            { new: true }  // Return the updated document
        );
        
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task', details: err.message });
    }
};
// Delete all tasks for a specific user
const delete_all_tasks_for_user = async (req, res) => {
    try {
        const { userId } = req.params;
        await TaskModel.deleteMany({ userId });
        res.status(200).json({ message: 'All tasks deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete tasks', details: err.message });
    }
}

// Delete a specific task by ID for a specific user
const delete_task_by_id_for_user = async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const task = await TaskModel.findOneAndDelete({ _id: taskId, user: userId }); // Ensure the user ID field matches
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task', details: err.message });
    }
};

module.exports = {
    view_tasks_by_user_id,
    view_task_by_id_for_user,
    create_new_task_for_user,
    update_task_by_id_for_user,
    delete_all_tasks_for_user,
    delete_task_by_id_for_user
};
