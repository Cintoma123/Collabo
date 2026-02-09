import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Up to 5 team members",
        "3 active projects",
        "Basic task management",
        "File uploads (1GB storage)",
        "Mobile app access",
        "Community support"
      ],
      cta: "Get Started Free",
      ctaLink: "/get-started",
      highlighted: false,
      popular: false
    },
    {
      name: "Pro",
      price: "$12",
      period: "per user/month",
      description: "Ideal for growing teams and professionals",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced task management",
        "File uploads (50GB storage)",
        "Real-time collaboration",
        "Custom workflows",
        "Priority support",
        "Integrations (Slack, GitHub, etc.)",
        "Advanced reporting"
      ],
      cta: "Start 14-Day Free Trial",
      ctaLink: "/get-started",
      highlighted: true,
      popular: true,
      save: "Save 20% with annual billing"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Advanced security & compliance",
        "SSO & SAML integration",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "24/7 premium support",
        "Onboarding assistance",
        "Custom SLAs"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      highlighted: false,
      popular: false,
      enterprise: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start with our free plan and upgrade as you grow. All plans include a 14-day free trial 
            with no credit card required.
          </p>
          

        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.highlighted ? 'ring-2 ring-blue-500/20 bg-gradient-to-br from-white to-blue-50/20 dark:from-gray-800 dark:to-blue-900/20' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="space-y-4">
                <Link
                  href={plan.ctaLink}
                  className={`w-full block text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : plan.enterprise
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Save Message */}
                {plan.save && (
                  <p className="text-center text-sm text-green-600 dark:text-green-400 font-medium">
                    {plan.save}
                  </p>
                )}
              </div>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <span>✓ No credit card required</span>
                  <span>✓ Cancel anytime</span>
                  <span>✓ Instant setup</span>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}