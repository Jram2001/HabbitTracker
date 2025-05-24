const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: String,
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

const habbit = mongoose.model('Habit', habitSchema);

module.exports = {
    Habbit,
};

