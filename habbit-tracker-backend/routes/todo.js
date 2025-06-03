var express = require('express');
var router = express.Router();
const todoController = require('../controller/todo-controller');

router.get('/getTodoData', todoController.getTodoData);
// router.patch('/updateTodoData', habbitController.getHabbitActivityStatus);
// router.post('/addTodoData', habbitController.getHabbitActivityStatus);
router.post('/updateTodo', todoController.updateTodo);
router.post('/deleteTodo', todoController.deleteTodo);

module.exports = router;
