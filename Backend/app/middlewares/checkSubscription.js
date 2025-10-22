const Subscription = require("../models/subscriptionModel");

const checkSubscription = async (req, res, next) => {
    try {
        let subscription = await Subscription.findOne({ userId: req.userId });

        if (!subscription) {
            subscription = new Subscription({ userId: req.userId, planName: "Free", jobPostsLimit: 3, jobPostsUsed: 0, isActive: true, endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) });
            await subscription.save();
        }

        // subscription is expired?
        if (subscription.endDate && new Date() > subscription.endDate) {
            subscription.isActive = false;
            await subscription.save();
            return res.status(403).json({ success: false, error: "Your subscription has expired. Please renew to continue posting jobs.", needsSubscription: true, subscriptionExpired: true, subscription: { planName: subscription.planName, jobPostsUsed: subscription.jobPostsUsed, jobPostsLimit: subscription.jobPostsLimit } });
        }

        const remainingPosts = subscription.jobPostsLimit - subscription.jobPostsUsed;
        if (remainingPosts <= 0 && subscription.isActive) {
            return res.status(403).json({ success: false, error: "Job posting limit reached. Please upgrade your subscription.", needsSubscription: true, limitReached: true, subscription: { planName: subscription.planName, jobPostsUsed: subscription.jobPostsUsed, jobPostsLimit: subscription.jobPostsLimit, remainingPosts: 0 } });
        }

        req.subscription = subscription;
        req.remainingPosts = remainingPosts;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error checking subscription status."
        });
    }
};

module.exports = checkSubscription;