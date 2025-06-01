const Models = require('../models/habbit-model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


module.exports.getHabbitActivityStatus = async (req, res) => {
    try {
        console.log('GET HABBIT ACTIVITY CALLED');
        const { habbitId, limit } = req.body;

        if (!habbitId || !limit) {
            return res.status(400).json({
                success: false,
                message: "Missing required feilds"
            })
        }

        if (!mongoose.Types.Objectid.isValid(habbitId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid habbit ID"
            })
        }

        const activityStatus = Models.Habbit.findOne(
            { _id: ObjectId(habbitId) },
            { activity: { $slice: limit }, habitId: _id }
        )

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: "Habit not found"
            });
        }

        return res.status(200).json({
            success: true,
            activity: activityStatus
        });


    } catch (error) {
        console.error('Error getting habit activity:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports.getHabitActivityByUser = async (req, res) => {
    try {
        const { userId, limit } = req.query;
        console.log('GET HABIT ACTIVITY BY USER CALLED', userId, limit);

        if (!userId || !limit) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Since userId is a string, validate it like this:
        if (typeof userId !== 'string' || userId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const habit = await Models.Habit.find(
            { userId: userId },
            { title: 1, activity: { $slice: parseInt(limit) }, _id: 1 }
        );

        const formatted = habit.map(habit => ({
            habitId: habit._id,
            title: habit.title,
            activity: habit.activity
        }));

        console.log(habit, 'habbit');
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: "Habit not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error('Error getting habit activity:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports.addNewHabbit = async (req, res) => {
    try {
        console.log('ADD NEW HABBIT CALLED');
        const { userId, title } = req.body;

        // Validate required fields
        if (!userId || !title) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId or title"
            });
        }

        // Optionally validate userId format if you expect ObjectId type
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId"
            });
        }

        // Create new habit document
        const newHabbit = new Models.Habit({
            userId,
            title,
            activity: [],
            startDate: new Date()
        });

        // Save to DB
        await newHabbit.save();

        // Return success response with new habit
        return res.status(201).json({
            success: true,
            habit: newHabbit
        });

    } catch (error) {
        console.error('Error adding new habit:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports.updateActivityStatus = async (req, res) => {
    try {

        const { habitId } = req.body;
        console.log('UPDATE NEW HABBIT CALLED', habitId);

        // Validate input
        if (!habitId) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: habitId"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(habitId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid habitId"
            });
        }

        // Fetch the habit
        const habbit = await Models.Habit.findById(habitId);
        if (!habbit) {
            return res.status(404).json({
                success: false,
                message: "Habit not found"
            });
        }

        const today = new Date().toISOString().split('T')[0];
        const activity = habbit.activity || [];

        const lastEntry = activity[activity.length - 1];
        const lastDate = lastEntry ? new Date(lastEntry).toISOString().split('T')[0] : null;

        if (lastDate === today) {
            activity.pop();
        } else {
            activity.push(new Date());
        }

        habbit.activity = activity;
        await habbit.save();

        return res.status(200).json({
            success: true,
            message: "Activity status updated successfully",
            updatedActivity: activity
        });

    } catch (error) {
        console.error('Error updating habit activity:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports.updateActivityData = async (req, res) => {
    try {
        const { habitId, title } = req.body;
        console.log(habitId, 'habitId', req.body)

        if (!habitId || !title) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: habbitId or title"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(habitId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid habitId"
            });
        }

        // Fetch the habit
        const habit = await Models.Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: "Habit not found"
            });
        }

        habit.title = title;
        await habit.save();

        return res.status(200).json({
            success: true,
            message: "Habit updated successfully",
            data: habit
        });

    } catch (error) {
        console.error("Error updating activity:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.deleteActivityData = async (req, res) => {
    try {
        const { habitId } = req.query;
        console.log('DELETE HABIT ACTIVITY CALLED', habitId);

        if (!habitId || typeof habitId !== 'string' || habitId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing habitId"
            });
        }

        const deleteHabit = await Models.Habit.deleteOne({
            _id: new mongoose.Types.ObjectId(habitId)
        });

        if (deleteHabit.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Habit not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Habit deleted successfully",
            data: deleteHabit
        });

    } catch (error) {
        console.error('Error deleting habit activity:', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

