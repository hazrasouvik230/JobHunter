// import { Link } from "react-router-dom";
// export default function Subscription() {
//   const plans = [
//     {
//       name: "Basic",
//       description: "Perfect for small companies just starting to hire",
//       price: "₹ 2,999",
//       period: "/month",
//       features: [
//         "Post up to 5 jobs",
//         "Access to 100 candidate profiles",
//         "Basic applicant tracking",
//         "Email support",
//       ],
//       popular: false,
//       buttonText: "Get Started"
//     },
//     {
//       name: "Professional",
//       description: "Ideal for growing businesses with regular hiring needs",
//       price: "₹ 7,999",
//       period: "/month",
//       features: [
//         "Post up to 20 jobs",
//         "Access to 500 candidate profiles",
//         "Advanced applicant tracking",
//         "Priority support",
//         "AI-powered candidate matching",
//       ],
//       popular: true,
//       buttonText: "Most Popular"
//     },
//     {
//       name: "Enterprise",
//       description: "For large organizations with extensive hiring requirements",
//       price: "₹ 14,999",
//       period: "/month",
//       features: [
//         "Unlimited job posts",
//         "Full candidate database access",
//         "Advanced analytics & reports",
//         "AI-powered candidate matching",
//         "Bulk candidate messaging",
//         "Premium employer branding",
//       ],
//       popular: false,
//       buttonText: "Contact Sales"
//     }
//   ];

//   return (
//     <div className='px-6 md:px-32 py-12 bg-gray-50'>
//       <div className='text-center mb-16 mt-16'>
//         <div className="absolute">
//           <span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/hr/post-job">Back</Link></span>
//         </div>

//         <h1 className='text-4xl font-bold text-gray-900 mb-4'>Choose Your Hiring Plan</h1>
//         <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Scale your recruitment efforts with our flexible subscription plans designed for HR professionals</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {
//             plans.map((plan, index) => (
//               <div key={plan.name} className={`relative p-8 rounded-2xl flex flex-col h-full transition-all duration-300 hover:scale-102 ${ plan.popular ? 'border-2 border-blue-500 bg-blue-50 shadow-xl' : 'border border-gray-200 bg-white shadow-lg' }`}>
//                 {
//                   plan.popular && (
//                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                       <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
//                     </div>
//                   )
//                 }
              
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
//                   <p className="text-gray-600 text-sm">{plan.description}</p>
//                 </div>

//                 <div className="text-center mb-6">
//                   <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
//                   <span className="text-gray-600 ml-2">/month</span>
//                 </div>

//                 <ul className="space-y-4 mb-8 flex-grow">
//                   {
//                     plan.features.map((feature, featureIndex) => (
//                       <li key={featureIndex} className="flex items-start">
//                         <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
//                         <span className="text-gray-700">{feature}</span>
//                       </li>
//                     ))
//                   }
//                 </ul>

//                 <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 cursor-pointer hover:font-bold ${ plan.popular ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600' : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-600' }`}>Get Started</button>
//               </div>
//             )
//           )
//         }
//       </div>

//       <div className="text-center mt-12">
//         <p className="text-gray-600">All plans include a 14-day free trial. No credit card required.</p>
//         <p className="text-gray-500 text-sm mt-2">Need a custom solution? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a></p>
//       </div>
//     </div>
//   );
// }



















import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Subscription() {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handlePurchase = async (planName, price) => {
    if (loading) return;

    const confirmPurchase = window.confirm(
      `Are you sure you want to purchase the ${planName} plan for ${price}?`
    );
    
    if (!confirmPurchase) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // In production, integrate with actual payment gateway
      const mockPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await axios.post(
        "http://localhost:3000/api/subscription/purchase",
        { 
          planName, 
          paymentId: mockPaymentId 
        },
        { headers: { Authorization: token } }
      );

      alert(response.data.message);
      navigate("/hr/post-job");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to purchase subscription");
      console.error("Purchase error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-16 mt-16 relative'>
        <div className="absolute left-0 top-0">
          <Link to="/hr/post-job" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Post Job
          </Link>
        </div>

        {currentSubscription && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
            <p className="text-sm text-gray-600">Current Plan</p>
            <p className="text-xl font-bold text-blue-600">{currentSubscription.planName}</p>
            <p className="text-sm text-gray-600">
              {currentSubscription.jobPostsUsed}/{currentSubscription.jobPostsLimit} posts used
            </p>
          </div>
        )}

        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Choose Your Hiring Plan</h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Scale your recruitment efforts with our flexible subscription plans designed for HR professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planName === plan.name;
          
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
                onClick={() => handlePurchase(plan.name, plan.price)}
                disabled={loading || isCurrentPlan}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : plan.popular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg cursor-pointer' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg cursor-pointer'
                } ${loading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">All plans include a 14-day free trial. No credit card required.</p>
        <p className="text-gray-500 text-sm mt-2">
          Need a custom solution? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
}





















// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// export default function Subscription() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const plans = [
//     {
//       name: "Basic",
//       description: "Perfect for small companies just starting to hire",
//       price: 2999,
//       displayPrice: "₹ 2,999",
//       period: "/month",
//       features: [
//         "Post up to 5 jobs",
//         "Access to 100 candidate profiles",
//         "Basic applicant tracking",
//         "Email support",
//       ],
//       popular: false,
//       buttonText: "Get Started"
//     },
//     {
//       name: "Professional",
//       description: "Ideal for growing businesses with regular hiring needs",
//       price: 7999,
//       displayPrice: "₹ 7,999",
//       period: "/month",
//       features: [
//         "Post up to 20 jobs",
//         "Access to 500 candidate profiles",
//         "Advanced applicant tracking",
//         "Priority support",
//         "AI-powered candidate matching",
//       ],
//       popular: true,
//       buttonText: "Most Popular"
//     },
//     {
//       name: "Enterprise",
//       description: "For large organizations with extensive hiring requirements",
//       price: 14999,
//       displayPrice: "₹ 14,999",
//       period: "/month",
//       features: [
//         "Unlimited job posts",
//         "Full candidate database access",
//         "Advanced analytics & reports",
//         "AI-powered candidate matching",
//         "Bulk candidate messaging",
//         "Premium employer branding",
//       ],
//       popular: false,
//       buttonText: "Contact Sales"
//     }
//   ];

//   const handlePurchase = async (plan) => {
//     if (loading) return;

//     const confirmPurchase = window.confirm(
//       `Are you sure you want to purchase the ${plan.name} plan for ${plan.displayPrice}/month?`
//     );

//     if (!confirmPurchase) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         "http://localhost:3000/api/subscription/purchase",
//         {
//           planName: plan.name,
//           price: plan.price
//         },
//         {
//           headers: {
//             Authorization: token
//           }
//         }
//       );

//       alert(response.data.message);
//       navigate("/hr/post-job");
//     } catch (error) {
//       console.log(error);
//       alert(error.response?.data?.message || "Failed to purchase subscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='px-6 md:px-32 py-12 bg-gray-50'>
//       <div className='text-center mb-16 mt-16'>
//         <div className="absolute">
//           <span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">
//             <Link to="/hr/post-job">← Back</Link>
//           </span>
//         </div>

//         <h1 className='text-4xl font-bold text-gray-900 mb-4'>Choose Your Hiring Plan</h1>
//         <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
//           Scale your recruitment efforts with our flexible subscription plans designed for HR professionals
//         </p>
//         <p className='text-sm text-green-600 mt-2 font-semibold'>
//           🎉 First 3 job posts are FREE - No credit card required!
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {plans.map((plan) => (
//           <div 
//             key={plan.name} 
//             className={`relative p-8 rounded-2xl flex flex-col h-full transition-all duration-300 hover:scale-102 ${
//               plan.popular 
//                 ? 'border-2 border-blue-500 bg-blue-50 shadow-xl' 
//                 : 'border border-gray-200 bg-white shadow-lg'
//             }`}
//           >
//             {plan.popular && (
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                 <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
//                   Most Popular
//                 </span>
//               </div>
//             )}
          
//             <div className="text-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
//               <p className="text-gray-600 text-sm">{plan.description}</p>
//             </div>

//             <div className="text-center mb-6">
//               <span className="text-4xl font-bold text-gray-900">{plan.displayPrice}</span>
//               <span className="text-gray-600 ml-2">/month</span>
//             </div>

//             <ul className="space-y-4 mb-8 flex-grow">
//               {plan.features.map((feature, featureIndex) => (
//                 <li key={featureIndex} className="flex items-start">
//                   <svg 
//                     className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth={2} 
//                       d="M5 13l4 4L19 7" 
//                     />
//                   </svg>
//                   <span className="text-gray-700">{feature}</span>
//                 </li>
//               ))}
//             </ul>

//             <button 
//               onClick={() => handlePurchase(plan)}
//               disabled={loading}
//               className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
//                 loading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : plan.popular 
//                     ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600 cursor-pointer hover:font-bold' 
//                     : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-600 cursor-pointer hover:font-bold'
//               }`}
//             >
//               {loading ? 'Processing...' : 'Get Started'}
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-12">
//         <p className="text-gray-600">All plans include a 14-day free trial. No credit card required.</p>
//         <p className="text-gray-500 text-sm mt-2">
//           Need a custom solution? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a>
//         </p>
//       </div>

//       {/* Free Tier Info Box */}
//       <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Start with Our Free Tier</h3>
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="flex items-start">
//             <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             <div>
//               <p className="font-semibold text-gray-800">3 Free Job Posts</p>
//               <p className="text-sm text-gray-600">Perfect for testing our platform</p>
//             </div>
//           </div>
//           <div className="flex items-start">
//             <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             <div>
//               <p className="font-semibold text-gray-800">No Credit Card Required</p>
//               <p className="text-sm text-gray-600">Start hiring immediately</p>
//             </div>
//           </div>
//         </div>
//         <p className="text-sm text-gray-700 mt-4 italic">
//           After using your 3 free posts, simply choose a plan that fits your hiring needs to continue posting jobs.
//         </p>
//       </div>
//     </div>
//   );
// }