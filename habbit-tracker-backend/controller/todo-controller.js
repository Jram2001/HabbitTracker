const Todo = require('../models/todo-model'); // Adjust path if needed
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Get all todo data for a given userId (from query param or hardcoded)
module.exports.getTodoData = async (req, res) => {
    try {
        const userId = req.query.userId;

        // Validate presence
        if (!userId) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'userId is required'
            });
        }

        // Validate format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                error: 'Bad Request',
                details: 'Invalid userId format'
            });
        }

        // Fetch todos
        const todos = await Todo.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();

        console.log(todos, 'todos');

        if (!todos || todos.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                details: 'No todos found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: todos,
            count: todos.length
        });

    } catch (error) {
        console.error('Error in getTodoData:', {
            error: error.message,
            stack: error.stack,
            userId: req.query.userId
        });

        if (error.name === 'MongoServerError') {
            return res.status(503).json({
                error: 'Database Error',
                details: 'Failed to connect to database'
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            details: 'Failed to fetch todos',
            message: error.message
        });
    }
};

// Update todo data by _id (sent in request body)
module.exports.updateHabbitActivityStatus = async (req, res) => {
    try {
        const { _id, todoData } = req.body;
        if (!_id || !todoData) {
            return res.status(400).json({ error: '_id and todoData are required for update' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            _id,
            { todoData },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo', details: error.message });
    }
};

// Add new todo data (expects userId and todoData in body)
module.exports.addHabbitActivityStatus = async (req, res) => {
    try {
        const { userId, todoData } = req.body;
        if (!userId || !todoData) {
            return res.status(400).json({ error: 'userId and todoData are required' });
        }

        const newTodo = new Todo({ userId, todoData });
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add todo', details: error.message });
    }
};

// Update todoData of a specific document
module.exports.updateTodo = async (req, res) => {
    try {
        const { _id, userId, todoData } = req.body;

        // Validation
        if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const updated = await Todo.findOneAndUpdate(
            { _id, userId },
            { $set: { todoData } },
            { new: true } // return the updated document
        );

        if (!updated) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.createInitialTodoForUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format');
    }

    const newTodo = new Todo({
        userId,
        todoData: [] // or provide default structure if needed
    });

    return await newTodo.save();
}

module.exports.deleteTodo = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const deleted = await Todo.findOneAndDelete({ _id });

        if (!deleted) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully',
            data: deleted
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
