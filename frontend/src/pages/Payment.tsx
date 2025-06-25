const plans = [
  {
    name: "Basic",
    price: "$9",
    frequency: "per month",
    features: ["1 Project", "100 Images", "Email Support"],
  },
  {
    name: "Pro",
    price: "$29",
    frequency: "per month",
    features: ["10 Projects", "1000 Images", "Priority Support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    frequency: "per month",
    features: ["Unlimited Projects", "Unlimited Images", "Dedicated Support"],
  },
];

const Payment = () => {
  return (
    <div className="py-12 px-4 md:px-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 shadow-lg border ${
              plan.highlight ? "bg-white border-blue-500 scale-105" : "bg-white"
            } transition-transform`}
          >
            <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
            <div className="text-center mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-500"> / {plan.frequency}</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
