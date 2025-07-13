import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubdomainInfo } from '@/types';
import { Layout as WaterRefillLayout } from '@/components/layouts/water-refill';
import { Home, ChevronRight, Droplets, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface WaterRefillContactPageProps {
  subdomainInfo: SubdomainInfo;
}

const WaterRefillContactPage: React.FC<WaterRefillContactPageProps> = ({ subdomainInfo }) => {
  // Update document title
  useEffect(() => {
    document.title = 'Contact Us - Water Refill Station Finder';
  }, []);

  return (
    <WaterRefillLayout subdomainInfo={subdomainInfo} showSearchBar={true}>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
            <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <span className="flex items-center text-gray-900">
              <Droplets className="w-4 h-4 mr-1" />
              Contact
            </span>
          </nav>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Have questions about water refill stations, need help with our platform, or want to list your business? 
              We're here to help! Get in touch with us using any of the methods below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href="mailto:support@near-me.us" className="text-blue-600 hover:text-blue-800">
                        support@near-me.us
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <a href="tel:+1-555-WATER-1" className="text-blue-600 hover:text-blue-800">
                        (555) WATER-1
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Address</div>
                      <div className="text-gray-600">
                        123 Clean Water Ave<br />
                        Suite 100<br />
                        Hydroville, CA 90210
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <div>Monday - Friday: 9:00 AM - 6:00 PM PST</div>
                    <div>Saturday: 10:00 AM - 4:00 PM PST</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="business">List My Business</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback/Suggestions</option>
                      <option value="partnership">Partnership Opportunities</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I find water refill stations near me?</h3>
                  <p className="text-gray-600">
                    Use our <Link to="/stations" className="text-blue-600 hover:text-blue-800">station finder</Link> to 
                    search by your location, city, or ZIP code. You can also browse stations on our interactive map.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I list my water refill business?</h3>
                  <p className="text-gray-600">
                    Visit our <Link to="/for-business" className="text-blue-600 hover:text-blue-800">business owners page</Link> to 
                    learn about listing your water refill station on our platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Are the water stations verified for quality?</h3>
                  <p className="text-gray-600">
                    Yes, all stations in our directory are verified for quality and safety standards. We work with businesses 
                    that maintain proper filtration systems and comply with local health regulations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Is this service free to use?</h3>
                  <p className="text-gray-600">
                    Yes, our platform is completely free for customers looking for water refill stations. We make money by 
                    helping water refill businesses connect with customers.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Need Immediate Help?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                For urgent issues or immediate assistance, don't hesitate to call us directly or start exploring 
                our platform right away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:+1-555-WATER-1"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Call Now
                </a>
                <Link 
                  to="/stations" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Find Stations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaterRefillLayout>
  );
};

export default WaterRefillContactPage;
