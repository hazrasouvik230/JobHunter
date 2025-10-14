const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");

const subscriptionController = {};

subscriptionController.getCurrentSubscription = async (req, res) => {
    try {
        let subscription = await Subscription.findOne({ userId: req.userId });
        
        if (!subscription) {
            // Create default free subscription
            subscription = new Subscription({
                userId: req.userId,
                planName: "Free",
                jobPostsLimit: 3,
                jobPostsUsed: 0,
                isActive: true,
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            await subscription.save();
        }

        const remainingPosts = subscription.jobPostsLimit - subscription.jobPostsUsed;
        
        res.status(200).json({
            success: true,
            subscription: {
                ...subscription.toObject(),
                remainingPosts,
                isExpired: subscription.endDate && new Date() > subscription.endDate
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching subscription details."
        });
    }
};

subscriptionController.purchaseSubscription = async (req, res) => {
    const { planName, paymentId } = req.body;
    
    try {
        // Define plan limits and durations
        const plans = {
            "Basic": { limit: 5, duration: 30, price: 2999 },
            "Professional": { limit: 20, duration: 30, price: 7999 },
            "Enterprise": { limit: -1, duration: 30, price: 14999 } // -1 for unlimited
        };

        if (!plans[planName]) {
            return res.status(400).json({
                success: false,
                error: "Invalid plan selected."
            });
        }

        const plan = plans[planName];
        const endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);

        let subscription = await Subscription.findOne({ userId: req.userId });

        if (subscription) {
            // Update existing subscription
            subscription.planName = planName;
            subscription.jobPostsLimit = plan.limit === -1 ? 999999 : plan.limit;
            subscription.jobPostsUsed = 0; // Reset on new purchase
            subscription.isActive = true;
            subscription.endDate = endDate;
            subscription.paymentId = paymentId;
            await subscription.save();
        } else {
            // Create new subscription
            subscription = new Subscription({
                userId: req.userId,
                planName,
                jobPostsLimit: plan.limit === -1 ? 999999 : plan.limit,
                jobPostsUsed: 0,
                isActive: true,
                endDate,
                paymentId
            });
            await subscription.save();
        }

        res.status(200).json({
            success: true,
            message: `Successfully subscribed to ${planName} plan!`,
            subscription
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error processing subscription purchase."
        });
    }
};

subscriptionController.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.userId });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: "No active subscription found."
            });
        }

        subscription.isActive = false;
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error cancelling subscription."
        });
    }
};

module.exports = subscriptionController;