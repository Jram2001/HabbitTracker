const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const habbitSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    activity: {
        type: [Date],
        default: []
    },
    startDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Habit = mongoose.model('Habit', habbitSchema);

module.exports = {
    Habit
};

