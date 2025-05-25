const Models = require('../models/habbit-model');
const mongoose = require('mongoose');


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
            { activity: { $slice: limit }, _id: 0 }
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
        const newHabbit = new Models.Habbit({
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
        console.log('UPDATE NEW HABBIT CALLED');

        const { habbitId } = req.body;

        // Validate input
        if (!habbitId) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: habbitId"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(habbitId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid habbitId"
            });
        }

        // Fetch the habit
        const habbit = await Models.Habbit.findById(habbitId);
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
