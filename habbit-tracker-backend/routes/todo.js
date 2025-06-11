var express = require('express');
var router = express.Router();
const todoController = require('../controller/todo-controller');
const middleware = require('../middleware/authenticate-token');

router.get('/getTodoData', middleware.authenticateToken, todoController.getTodoData);
// router.patch('/updateTodoData', habbitController.getHabbitActivityStatus);
// router.post('/addTodoData', habbitController.getHabbitActivityStatus);
router.post('/updateTodo', middleware.authenticateToken, todoController.updateTodo);
router.post('/deleteTodo', middleware.authenticateToken, todoController.deleteTodo);

module.exports = router;
