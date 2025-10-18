const Razorpay = require("razorpay");
const crypto = require("crypto");

const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");

const subscriptionController = {};

// console.log("Key:", process.env.RAZORPAY_API_KEY);
// console.log("Secret key:", process.env.RAZORPAY_API_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET_KEY,
});

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

subscriptionController.createSubscriptionOrder = async (req, res) => {
    try {
        const { planName } = req.body;

        const planPrices = {
            "Basic": 2999 * 100,
            "Professional": 7999 * 100,
            "Enterprise": 14999 * 100
        };

        if(!planPrices[planName]) {
            return res.status(400).json({ success: false, message: "Invalid plan." });
        }

        const amount = planPrices[planName];

        const option = {
            amount: amount,
            currency: "INR",
            receipt: `sub_${Date.now()}`,
            notes: {
                planName, userId: req.userId.toString()
            }
        };

        const order = await razorpayInstance.orders.create(option);
        res.status(200).json({ success: true, order: { id: order.id, amount: order.amount, currency: order.currency, planName: planName } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating subscription order." });
    }
};

subscriptionController.verification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body;
        
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET_KEY).update(body.toString()).digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: "Payment verification failed. Please try again." });
        }

        const plans = {
            "Basic": { limit: 5, duration: 30 },
            "Professional": { limit: 20, duration: 30 },
            "Enterprise": { limit: -1, duration: 30 }
        };

        const plan = plans[planName];
        const endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);

        let subscription = await Subscription.findOne({ userId: req.userId });

        if (subscription) {
        // Existing subscription update
            subscription.planName = planName;
            subscription.jobPostsLimit = plan.limit === -1 ? 999999 : plan.limit;
            subscription.jobPostsUsed = 0;
            subscription.isActive = true;
            subscription.endDate = endDate;
            subscription.paymentId = razorpay_payment_id;
            subscription.razorpayOrderId = razorpay_order_id;
            await subscription.save();
        } else {
        // Create new subscription
            subscription = new Subscription({ userId: req.userId, planName, jobPostsLimit: plan.limit === -1 ? 999999 : plan.limit, jobPostsUsed: 0, isActive: true, endDate, paymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id });
            await subscription.save();
        }

        res.status(200).json({ success: true, message: `Payment successful! You've subscribed to ${planName} plan.`, paymentId: razorpay_payment_id, subscription });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error activating subscription after payment." });
    }
};

// subscriptionController.purchaseSubscription = async (req, res) => {
//     const { planName, paymentId } = req.body;
    
//     try {
//         // Define plan limits and durations
//         const plans = {
//             "Basic": { limit: 5, duration: 30, price: 2999 },
//             "Professional": { limit: 20, duration: 30, price: 7999 },
//             "Enterprise": { limit: -1, duration: 30, price: 14999 } // -1 for unlimited
//         };

//         if (!plans[planName]) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Invalid plan selected."
//             });
//         }

//         const plan = plans[planName];
//         const endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);

//         let subscription = await Subscription.findOne({ userId: req.userId });

//         if (subscription) {
//             // Update existing subscription
//             subscription.planName = planName;
//             subscription.jobPostsLimit = plan.limit === -1 ? 999999 : plan.limit;
//             subscription.jobPostsUsed = 0; // Reset on new purchase
//             subscription.isActive = true;
//             subscription.endDate = endDate;
//             subscription.paymentId = paymentId;
//             await subscription.save();
//         } else {
//             // Create new subscription
//             subscription = new Subscription({
//                 userId: req.userId,
//                 planName,
//                 jobPostsLimit: plan.limit === -1 ? 999999 : plan.limit,
//                 jobPostsUsed: 0,
//                 isActive: true,
//                 endDate,
//                 paymentId
//             });
//             await subscription.save();
//         }

//         res.status(200).json({
//             success: true,
//             message: `Successfully subscribed to ${planName} plan!`,
//             subscription
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Error processing subscription purchase."
//         });
//     }
// };

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

subscriptionController.getRazorpayKey = async (req, res) => {
    try {
        res.status(200).json({ success: true, key: process.env.RAZORPAY_API_KEY });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching payment key." });
    }
};

subscriptionController.getSubscriptionPlans = async (req, res) => {
    try {
        const plans = {
        "Free": { 
            price: 0, 
            limit: 3, 
            duration: 30,
            features: ["3 Job Posts", "Basic Analytics", "30 Days Validity"]
        },
        "Basic": { 
            price: 2999, 
            limit: 5, 
            duration: 30,
            features: ["5 Job Posts", "Advanced Analytics", "Priority Support", "30 Days Validity"]
        },
        "Professional": { 
            price: 7999, 
            limit: 20, 
            duration: 30,
            features: ["20 Job Posts", "Advanced Analytics", "Priority Support", "Candidate Filtering", "30 Days Validity"]
        },
        "Enterprise": { 
            price: 14999, 
            limit: -1, 
            duration: 30,
            features: ["Unlimited Job Posts", "All Features", "Dedicated Support", "Custom Branding", "30 Days Validity"]
        }
        };

        res.status(200).json({ success: true, plans });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching subscription plans." });
    }
};

// subscriptionController.listOfSubscriptions = async (req, res) => {
//     try {
//         const subscriptions = await Subscription.find()
//             .populate('userId', 'companyName name email') // Assuming these fields in User model
//             .select('planName jobPostsLimit jobPostsUsed isActive endDate paymentId razorpayOrderId createdAt')
//             .sort({ createdAt: -1 });

//         const formattedSubscriptions = subscriptions.map(sub => ({
//             paymentId: sub.paymentId,
//             companyName: sub.userId?.companyName || 'N/A',
//             hrName: sub.userId?.name || 'N/A',
//             planName: sub.planName,
//             amount: subscriptionController.getPlanPrice(sub.planName), // You'll need to implement this
//             time: sub.createdAt,
//             status: sub.isActive ? 'Active' : 'Inactive'
//         }));

//         res.status(200).json({
//             success: true,
//             subscriptions: formattedSubscriptions,
//             total: formattedSubscriptions.length
//         });
//     } catch (error) {
//         console.error("List subscriptions error:", error);
//         res.status(500).json({ 
//             success: false, 
//             message: "Error fetching subscription details." 
//         });
//     }
// };

// // Helper method to get plan price
// subscriptionController.getPlanPrice = (planName) => {
//     const planPrices = {
//         "Free": 0,
//         "Basic": 2999,
//         "Professional": 7999,
//         "Enterprise": 14999
//     };
//     return planPrices[planName] || 0;
// };

subscriptionController.transactions = async (req, res) => {
    try {
        const planPrices = {
            "Free": 0,
            "Basic": 2999,
            "Professional": 7999,
            "Enterprise": 14999
        };

        // Fetch all subscriptions with user details, excluding free plan entries without payment
        const subscriptions = await Subscription.find({
            $or: [
                { paymentId: { $exists: true, $ne: null } }, // Has payment ID
                { planName: { $ne: "Free" } } // Or not a free plan
            ]
        })
            .populate('userId', 'companyName name email')
            .select('planName jobPostsLimit jobPostsUsed isActive endDate startDate paymentId razorpayOrderId amountPaid currency createdAt updatedAt')
            .sort({ createdAt: -1 });

        const transactions = subscriptions.map(sub => {
            const amount = sub.amountPaid || planPrices[sub.planName] || 0;
            
            return {
                transactionId: sub.paymentId || sub._id.toString(),
                orderId: sub.razorpayOrderId || 'N/A',
                companyName: sub.userId?.companyName || 'N/A',
                hrName: sub.userId?.name || 'N/A',
                email: sub.userId?.email || 'N/A',
                planName: sub.planName,
                amount: amount,
                currency: sub.currency || 'INR',
                jobPostsLimit: sub.jobPostsLimit,
                jobPostsUsed: sub.jobPostsUsed,
                status: sub.isActive ? 'Active' : 'Inactive',
                purchaseDate: sub.createdAt,
                startDate: sub.startDate || sub.createdAt,
                endDate: sub.endDate,
                isExpired: sub.endDate ? new Date() > sub.endDate : false,
                lastUpdated: sub.updatedAt
            };
        });

        // Calculate summary statistics
        const summary = {
            totalTransactions: transactions.length,
            totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
            activeSubscriptions: transactions.filter(t => t.status === 'Active').length,
            expiredSubscriptions: transactions.filter(t => t.isExpired).length,
            planBreakdown: {
                Free: transactions.filter(t => t.planName === 'Free').length,
                Basic: transactions.filter(t => t.planName === 'Basic').length,
                Professional: transactions.filter(t => t.planName === 'Professional').length,
                Enterprise: transactions.filter(t => t.planName === 'Enterprise').length
            }
        };

        res.status(200).json({
            success: true,
            transactions,
            summary,
            total: transactions.length
        });
    } catch (error) {
        console.error("Transactions error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching transaction details." 
        });
    }
};

module.exports = subscriptionController;