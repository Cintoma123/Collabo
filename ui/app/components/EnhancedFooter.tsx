import Link from "next/link";

export default function EnhancedFooter() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Integrations", href: "/integrations" },
      { name: "Roadmap", href: "/roadmap" },
      { name: "Mobile App", href: "/mobile" },
      { name: "API", href: "/api" }
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
      { name: "Contact", href: "/contact" },
      { name: "Partners", href: "/partners" }
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Webinars", href: "/webinars" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Security", href: "/security" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR Compliance", href: "/gdpr" },
      { name: "SLA", href: "/sla" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: "twitter", href: "https://twitter.com/collabo" },
    { name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/company/collabo" },
    { name: "GitHub", icon: "github", href: "https://github.com/collabo" },
    { name: "YouTube", icon: "youtube", href: "https://youtube.com/collabo" },
    { name: "Facebook", icon: "facebook", href: "https://facebook.com/collabo" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Collabo</h3>
                <p className="text-gray-400 text-sm">Project Management Reimagined</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering teams to collaborate effectively and achieve their goals. 
              Join thousands of teams who have already transformed their workflow.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-200">Stay Updated</h4>
              <form className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 font-medium"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold text-gray-200 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Collabo. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-200 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon === "twitter" && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />}
                    {social.icon === "linkedin" && <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />}
                    {social.icon === "github" && <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />}
                    {social.icon === "youtube" && <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.903V8.097L15.818 12l-6.273 3.903z" />}
                    {social.icon === "facebook" && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                  </svg>
                </Link>
              ))}
            </div>

            {/* App Store Badges */}
            <div className="flex gap-2">
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-1-7h2v-6h-2v6zm0 3h2v1h-2v-1z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400 hover:text-white">Available on</div>
                  <div className="font-semibold text-sm">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-1-7h2v-6h-2v6zm0 3h2v1h-2v-1z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400 hover:text-white">Get it on</div>
                  <div className="font-semibold text-sm">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span>Security: SOC 2 | ISO 27001 | HIPAA</span>
              <span>Payments: PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}