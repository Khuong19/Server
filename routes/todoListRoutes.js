const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoListController');
const authController = require('../controllers/authController');

// Define routes
router.get('/search', authController.isAuthenticated, todoController.searchTasks);

router.route('/:userId')
    .get(authController.isAuthenticated, todoController.view_tasks_by_user_id)
    .post(authController.isAuthenticated, todoController.create_new_task_for_user);

router.route('/:userId/:taskId')
    .get(authController.isAuthenticated, todoController.view_task_by_id_for_user)
    .put(authController.isAuthenticated, todoController.update_task_by_id_for_user)
    .delete(authController.isAuthenticated, todoController.delete_task_by_id_for_user);


module.exports = router;
