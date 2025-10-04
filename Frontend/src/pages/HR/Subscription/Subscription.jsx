import { Link } from "react-router-dom";
export default function Subscription() {
  const plans = [
    {
      name: "Basic",
      description: "Perfect for small companies just starting to hire",
      price: "₹ 2,999",
      period: "/month",
      features: [
        "Post up to 5 jobs",
        "Access to 100 candidate profiles",
        "Basic applicant tracking",
        "Email support",
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with regular hiring needs",
      price: "₹ 7,999",
      period: "/month",
      features: [
        "Post up to 20 jobs",
        "Access to 500 candidate profiles",
        "Advanced applicant tracking",
        "Priority support",
        "AI-powered candidate matching",
      ],
      popular: true,
      buttonText: "Most Popular"
    },
    {
      name: "Enterprise",
      description: "For large organizations with extensive hiring requirements",
      price: "₹ 14,999",
      period: "/month",
      features: [
        "Unlimited job posts",
        "Full candidate database access",
        "Advanced analytics & reports",
        "AI-powered candidate matching",
        "Bulk candidate messaging",
        "Premium employer branding",
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50'>
      <div className='text-center mb-16 mt-16'>
        <div className="absolute">
          <span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/hr/post-job">Back</Link></span>
        </div>

        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Choose Your Hiring Plan</h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Scale your recruitment efforts with our flexible subscription plans designed for HR professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {
            plans.map((plan, index) => (
              <div key={plan.name} className={`relative p-8 rounded-2xl flex flex-col h-full transition-all duration-300 hover:scale-102 ${ plan.popular ? 'border-2 border-blue-500 bg-blue-50 shadow-xl' : 'border border-gray-200 bg-white shadow-lg' }`}>
                {
                  plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                    </div>
                  )
                }
              
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {
                    plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))
                  }
                </ul>

                <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 cursor-pointer hover:font-bold ${ plan.popular ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600' : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-600' }`}>Get Started</button>
              </div>
            )
          )
        }
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">All plans include a 14-day free trial. No credit card required.</p>
        <p className="text-gray-500 text-sm mt-2">Need a custom solution? <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a></p>
      </div>
    </div>
  );
}