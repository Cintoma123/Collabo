import TestimonialCard from "./TestimonialCard";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Collabo has completely transformed how our team collaborates. The Kanban boards are intuitive, and the real-time sync keeps everyone on the same page. We've seen a 40% increase in project completion speed.",
      author: "Sarah Johnson",
      role: "Project Manager",
      company: "TechCorp Solutions",
      rating: 5,
      avatar: "/images/testimonials/sarah.jpg"
    },
    {
      quote: "As a remote team of 50+ developers, finding the right project management tool was crucial. Collabo's automation features and integrations with our existing tools made the transition seamless.",
      author: "Marcus Chen",
      role: "CTO",
      company: "Innovate Labs",
      rating: 5,
      avatar: "/images/testimonials/marcus.jpg"
    },
    {
      quote: "The reporting features in Collabo have given us incredible insights into our team's performance. We can now make data-driven decisions that have improved our delivery times by 30%.",
      author: "Elena Rodriguez",
      role: "Operations Director",
      company: "Global Marketing Group",
      rating: 5,
      avatar: "/images/testimonials/elena.jpg"
    },
    {
      quote: "I was skeptical about switching from our old system, but Collabo's user-friendly interface won over our entire team within days. The customer support team has been exceptional throughout our onboarding.",
      author: "James Wilson",
      role: "Team Lead",
      company: "Creative Studio",
      rating: 4,
      avatar: "/images/testimonials/james.jpg"
    },
    {
      quote: "Collabo's advanced permissions system was exactly what we needed for our enterprise environment. We can now securely manage multiple departments with different access levels.",
      author: "Dr. Amanda Lee",
      role: "IT Security Manager",
      company: "HealthTech Systems",
      rating: 5,
      avatar: "/images/testimonials/amanda.jpg"
    },
    {
      quote: "The mobile app is incredibly well-designed. I can manage my projects and stay updated while traveling, which has been a game-changer for my productivity.",
      author: "Robert Kim",
      role: "Sales Director",
      company: "Pacific Distributors",
      rating: 4,
      avatar: "/images/testimonials/robert.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trusted by Thousands</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied teams who have transformed their workflow with Collabo. 
            Here's what they have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                label: "Happy Teams",
                value: "5,000+",
                icon: "teams",
                color: "from-blue-500 to-cyan-500"
              },
              {
                label: "Projects Completed",
                value: "50,000+",
                icon: "projects",
                color: "from-purple-500 to-pink-500"
              },
              {
                label: "Countries",
                value: "89",
                icon: "globe",
                color: "from-green-500 to-emerald-500"
              },
              {
                label: "5-Star Reviews",
                value: "4.9/5",
                icon: "stars",
                color: "from-orange-500 to-red-500"
              }
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {stat.icon === "teams" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />}
                    {stat.icon === "projects" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                    {stat.icon === "globe" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.9c.52 0 1.02.075 1.5.225M8 3.9c-.52 0-1.02.075-1.5.225m0 0A8.976 8.976 0 013 12v-1.5m0 0a8.976 8.976 0 001.5.225m0 0v1.5m0-1.5a8.976 8.976 0 001.5-.225m0 0A8.976 8.976 0 0121 12v-1.5m0 0a8.976 8.976 0 00-1.5-.225m0 0v1.5m0-1.5c-.52 0-1.02-.075-1.5-.225m1.5 2.25a4.483 4.483 0 01-1.5 4m1.5-4v-1.5m0 1.5c.52 0 1.02.075 1.5.225m-1.5-.225a4.483 4.483 0 00-1.5-4m1.5 4H9m-1.5-4H5a2 2 0 00-2 2v1a2 2 0 002 2h.5" />}
                    {stat.icon === "stars" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />}
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Logos */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <p className="text-gray-600 dark:text-gray-400">Trusted by leading companies worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70 hover:opacity-100 transition-all duration-300">
            {[
              { name: "TechCorp", color: "from-blue-500 to-cyan-500" },
              { name: "Innovate", color: "from-purple-500 to-pink-500" },
              { name: "Global", color: "from-green-500 to-emerald-500" },
              { name: "Creative", color: "from-orange-500 to-red-500" },
              { name: "HealthTech", color: "from-indigo-500 to-purple-500" },
              { name: "Pacific", color: "from-blue-400 to-cyan-400" }
            ].map((company, index) => (
              <div
                key={index}
                className={`text-2xl font-bold bg-gradient-to-br ${company.color} text-transparent bg-clip-text text-center transition-all duration-300 hover:scale-110`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}