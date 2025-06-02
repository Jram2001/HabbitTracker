const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    todoData: {
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }
});

module.exports = mongoose.model('Todo', todoSchema);
