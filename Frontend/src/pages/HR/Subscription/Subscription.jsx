import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function Subscription() {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [unauthorize, setUnauthorize] = useState(false);
  
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      description: "Perfect for small companies just starting to hire",
      price: "₹ 2,999",
      priceValue: 2999,
      period: "/month",
      jobPosts: 5,
      features: [
        "Post up to 5 jobs",
        "Access to 100 candidate profiles",
        "Basic applicant tracking",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with regular hiring needs",
      price: "₹ 7,999",
      priceValue: 7999,
      period: "/month",
      jobPosts: 20,
      features: [
        "Post up to 20 jobs",
        "Access to 500 candidate profiles",
        "Advanced applicant tracking",
        "Priority support",
        "AI-powered candidate matching",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with extensive hiring requirements",
      price: "₹ 14,999",
      priceValue: 14999,
      period: "/month",
      jobPosts: -1,
      features: [
        "Unlimited job posts",
        "Full candidate database access",
        "Advanced analytics & reports",
        "AI-powered candidate matching",
        "Bulk candidate messaging",
        "Premium employer branding",
      ],
      popular: false,
    }
  ];

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/subscription/current", {
        headers: { Authorization: token }
      });
      setCurrentSubscription(response.data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const initializeRazorpayPayment = async (plan) => {
    if (loading) return;

    const confirmPurchase = window.confirm(
      `Are you sure you want to purchase the ${plan.name} plan for ${plan.price}?`
    );
    
    if (!confirmPurchase) return;

    setLoading(true);
    setProcessingPlan(plan.name);

    try {
      const token = localStorage.getItem("token");
      
      // Step 1: Get Razorpay key
      const { data: keyData } = await axios.get(
        "http://localhost:3000/api/subscription/get-key",
        { headers: { Authorization: token } }
      );

      // Step 2: Create order
      const { data: orderData } = await axios.post(
        "http://localhost:3000/api/subscription/create-order",
        { planName: plan.name },
        { headers: { Authorization: token } }
      );

      // Step 3: Load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Step 4: Get user details from localStorage or context
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      // Step 5: Initialize Razorpay checkout
      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency || 'INR',
        name: 'Job Portal Pro',
        description: `${plan.name} Subscription Plan`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // This function will be called after successful payment
          await verifyPayment(response, plan.name);
        },
        prefill: {
          name: userData.name || 'HR User',
          email: userData.email || 'hr@company.com',
          contact: userData.phone || '9999999999'
        },
        theme: {
          color: '#2563eb' // blue color matching your theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setProcessingPlan(null);
            console.log('Payment modal closed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert(error.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  const verifyPayment = async (paymentResponse, planName) => {
    try {
      const token = localStorage.getItem("token");
      
      const { data } = await axios.post(
        "http://localhost:3000/api/subscription/verify-payment",
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          planName: planName
        },
        { headers: { Authorization: token } }
      );

      // Payment successful
      alert(data.message || 'Subscription activated successfully!');
      
      // Refresh subscription data
      await fetchCurrentSubscription();
      
      // Navigate to post job page
      navigate("/hr/post-job");

    } catch (error) {
      console.error('Payment verification error:', error);
      alert(error.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  const handlePurchase = async (plan) => {
    await initializeRazorpayPayment(plan);
  };

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-16 mt-16 relative'>
        <div className="absolute left-0 top-0"><Link to="/hr/post-job" className="text-gray-400 hover:text-blue-800 hover:font-semibold">Back</Link></div>

        <h1 className='text-4xl text-shadow-lg font-bold text-gray-900 mb-4'>Choose Your Hiring Plan</h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Scale your recruitment efforts with our flexible subscription plans designed for HR professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planName === plan.name;
          const isProcessing = processingPlan === plan.name;
          
          return (
            <div 
              key={plan.name} 
              className={`relative p-8 rounded-2xl flex flex-col h-full transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-2 border-blue-500 bg-blue-50 shadow-xl' 
                  : 'border border-gray-200 bg-white shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
                <p className="text-sm text-gray-500 mt-2">
                  {plan.jobPosts === -1 ? 'Unlimited' : plan.jobPosts} job posts
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg 
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={loading || isCurrentPlan}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : plan.popular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg cursor-pointer' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg cursor-pointer'
                } ${(loading && isProcessing) ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isProcessing ? 'Opening Payment...' : 
                 isCurrentPlan ? 'Current Plan' : 
                 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-700">Processing your subscription...</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-gray-600">Secure payments powered by Razorpay</p>
        <p className="text-gray-500 text-sm mt-2">
          Need a custom solution? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
}