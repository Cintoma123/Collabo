export default function FAQSection() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I get started with Collabo?",
          answer: "Getting started with Collabo is easy! Simply sign up for a free account, invite your team members, and start creating projects. Our intuitive onboarding process will guide you through setting up your first project and team workspace.",
          icon: "rocket"
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes! We offer a 14-day free trial of our Pro plan with no credit card required. During your trial, you'll have access to all Pro features to see how Collabo can benefit your team.",
          icon: "trial"
        },
        {
          question: "How many team members can I invite?",
          answer: "Our Free plan supports up to 5 team members. The Pro plan includes unlimited team members, allowing your entire organization to collaborate seamlessly.",
          icon: "users"
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          question: "What integrations does Collabo support?",
          answer: "Collabo integrates with popular tools including Slack, GitHub, Google Workspace, Microsoft Teams, Jira, and many more. Our integration ecosystem is constantly growing based on customer feedback.",
          icon: "integration"
        },
        {
          question: "Can I customize workflows and boards?",
          answer: "Absolutely! Collabo offers fully customizable Kanban boards, workflows, and automation rules. You can tailor the platform to match your team's unique processes and requirements.",
          icon: "customize"
        }
         
      ]
    },
    {
      category: "Security & Compliance",
      questions: [
        {
          question: "Is my data secure with Collabo?",
          answer: "Security is our top priority. We use industry-standard encryption, regular security audits, and comply with GDPR and other data protection regulations. Your data is safe with us.",
          icon: "security"
        },
        {
          question: "Do you offer SSO/SAML integration?",
          answer: "Yes, SSO and SAML integration is available on our Enterprise plan. This allows you to integrate Collabo with your existing identity provider for seamless authentication.",
          icon: "sso"
        },
        {
          question: "Where is my data stored?",
          answer: "We store data in secure data centers with multiple redundancy and backup systems. You can choose your data region based on compliance requirements during setup.",
          icon: "data"
        }
      ]
    },
    {
      category: "Billing & Plans",
      questions: [
        {
          question: "Can I change my plan at any time?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to all Pro features. Downgrades take effect at the end of your billing cycle.",
          icon: "billing"
        },
        {
          question: "Do you offer discounts for annual billing?",
          answer: "Yes, we offer a 20% discount when you choose annual billing. This is automatically applied when you select the yearly option during checkout.",
          icon: "discount"
        },
        {
          question: "What happens to my data if I cancel?",
          answer: "If you cancel your subscription, your data will remain accessible for 30 days. During this period, you can export all your project data. After 30 days, your data will be permanently deleted.",
          icon: "cancel"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Collabo. If you don't find what you're looking for, 
            our support team is always here to help.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {category.questions[0].icon === "rocket" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                      {category.questions[0].icon === "trial" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                      {category.questions[0].icon === "users" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />}
                      {category.questions[0].icon === "integration" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />}
                      {category.questions[0].icon === "customize" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                      {category.questions[0].icon === "mobile" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                      {category.questions[0].icon === "security" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                      {category.questions[0].icon === "sso" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                      {category.questions[0].icon === "data" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                      {category.questions[0].icon === "billing" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                      {category.questions[0].icon === "discount" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                      {category.questions[0].icon === "cancel" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{category.category}</h3>
                    <p className="text-blue-100 text-sm mt-1">Common questions about {category.category.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="p-8">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${category.questions[0].icon === "rocket" ? "from-blue-500 to-cyan-500" : category.questions[0].icon === "trial" ? "from-purple-500 to-pink-500" : category.questions[0].icon === "users" ? "from-green-500 to-emerald-500" : category.questions[0].icon === "integration" ? "from-orange-500 to-red-500" : category.questions[0].icon === "customize" ? "from-indigo-500 to-purple-500" : category.questions[0].icon === "mobile" ? "from-blue-400 to-cyan-400" : category.questions[0].icon === "security" ? "from-red-500 to-orange-500" : category.questions[0].icon === "sso" ? "from-purple-600 to-pink-600" : category.questions[0].icon === "data" ? "from-green-600 to-emerald-600" : category.questions[0].icon === "billing" ? "from-blue-600 to-cyan-600" : category.questions[0].icon === "discount" ? "from-yellow-500 to-orange-500" : "from-gray-500 to-gray-600"} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {faq.icon === "rocket" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                              {faq.icon === "trial" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                              {faq.icon === "users" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />}
                              {faq.icon === "integration" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />}
                              {faq.icon === "customize" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                              {faq.icon === "mobile" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                              {faq.icon === "security" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                              {faq.icon === "sso" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                              {faq.icon === "data" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4m0 0V7a4 4 0 018 0v4M5 9h14l1 12H4L5 9z" />}
                              {faq.icon === "billing" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                              {faq.icon === "discount" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                              {faq.icon === "cancel" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{faq.question}</h4>
                        </div>
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}