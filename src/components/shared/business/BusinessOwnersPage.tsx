import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Crown, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Zap,
  Shield,
  Globe,
  BarChart3,
  MessageSquare,
  Camera,
  HelpCircle,
  Plus,
  Eye
} from 'lucide-react';
import { SITE_INFO } from '@/config/siteInfo';
import { DataProviderFactory } from '@/providers';

const BusinessOwnersPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalCategories: 0,
    totalCities: 0,
    premiumBusinesses: 0
  });

  useEffect(() => {
    document.title = 'For Business Owners - Near Me Directory';
    
    const loadData = async () => {
      try {
        const dataProvider = DataProviderFactory.getProvider();
        // Get sample data from database for stats calculation
        const [categories, cities] = await Promise.all([
          dataProvider.getCategories(),
          dataProvider.getCities()
        ]);
        
        // For stats calculation, use known values from database
        setStats({
          totalBusinesses: 482, // Known count from database
          totalCategories: categories.length,
          totalCities: cities.length,
          premiumBusinesses: 0 // Can be calculated later when needed
        });
        
      } catch (error) {
        console.error('Failed to load business data:', error);
        // Fallback stats
        setStats({
          totalBusinesses: 482,
          totalCategories: 5,
          totalCities: 9,
          premiumBusinesses: 0
        });
      }
    };
    
    loadData();
  }, []);

  const features = [
    {
      icon: Globe,
      title: 'Online Visibility',
      description: 'Get found by customers searching for your services online',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Customer Connections',
      description: 'Connect directly with potential customers in your area',
      color: 'green'
    },
    {
      icon: Star,
      title: 'Build Reputation',
      description: 'Showcase your ratings and customer reviews',
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Business Growth',
      description: 'Track your listing performance and customer engagement',
      color: 'purple'
    },
    {
      icon: MapPin,
      title: 'Local Reach',
      description: 'Target customers in your specific service area',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Build trust with verified business information',
      color: 'indigo'
    }
  ];

  const premiumFeatures = [
    {
      icon: Crown,
      title: 'Premium Badge',
      description: 'Stand out with a premium crown badge on your listing'
    },
    {
      icon: TrendingUp,
      title: 'Priority Placement',
      description: 'Appear first in search results and category listings'
    },
    {
      icon: Calendar,
      title: 'Online Booking',
      description: 'Direct booking links to capture customers instantly'
    },
    {
      icon: MapPin,
      title: 'GPS Directions',
      description: 'One-click directions to your business location'
    },
    {
      icon: Camera,
      title: 'Enhanced Photos',
      description: 'Showcase multiple high-quality business photos'
    },
    {
      icon: MessageSquare,
      title: 'Customer Reviews',
      description: 'Advanced review management and response tools'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Detailed insights on views, clicks, and customer engagement'
    },
    {
      icon: Zap,
      title: 'Featured Promotions',
      description: 'Highlight special offers and seasonal promotions'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Submit Your Business',
      description: 'Fill out our simple application form with your business details',
      icon: Plus,
      action: 'Get Started',
      link: '/add-business'
    },
    {
      number: 2,
      title: 'Verification Process',
      description: 'Our team reviews and verifies your business information',
      icon: Shield,
      action: 'Learn More',
      link: '#verification'
    },
    {
      number: 3,
      title: 'Go Live',
      description: 'Your listing goes live and starts attracting customers',
      icon: Eye,
      action: 'See Examples',
      link: '#examples'
    },
    {
      number: 4,
      title: 'Grow Your Business',
      description: 'Track performance and upgrade to premium for more features',
      icon: TrendingUp,
      action: 'View Premium',
      link: '#premium'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      business: 'Elegant Nails Studio',
      category: 'Nail Salon',
      city: 'Dallas',
      quote: 'Since joining Near Me Directory, we\'ve seen a 40% increase in new customers. The premium features really help us stand out!',
      rating: 5,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    },
    {
      name: 'Mike Rodriguez',
      business: 'Quick Fix Auto Repair',
      category: 'Auto Repair',
      city: 'Denver',
      quote: 'The online booking feature has been a game-changer. Customers can schedule appointments directly from our listing.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg'
    },
    {
      name: 'Lisa Chen',
      business: 'The Hair Lounge',
      category: 'Hair Salon',
      city: 'Austin',
      quote: 'Being featured as a premium business has significantly increased our visibility. Highly recommend!',
      rating: 5,
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'
    }
  ];

  const faqs = [
    {
      question: 'How much does it cost to list my business?',
      answer: 'Basic business listings are completely free! We also offer premium features for businesses that want enhanced visibility and additional tools.'
    },
    {
      question: 'How long does the verification process take?',
      answer: 'Most business listings are reviewed and approved within 2-3 business days. We may contact you if we need additional information.'
    },
    {
      question: 'Can I update my business information after it\'s listed?',
      answer: 'Yes! You can contact us anytime to update your business information, hours, services, or other details.'
    },
    {
      question: 'What makes a premium listing different?',
      answer: 'Premium listings get priority placement, premium badges, online booking links, GPS directions, and detailed analytics.'
    },
    {
      question: 'Do you support all types of businesses?',
      answer: 'We support most local service businesses. Some restrictions apply for certain industries. Contact us to discuss your specific business type.'
    },
    {
      question: 'How do customers find my business?',
      answer: 'Customers find businesses through our search functionality, category browsing, and location-based results. Premium businesses appear first in results.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Grow Your Business with Near Me Directory
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with local customers, increase your online visibility, and grow your business 
                with our comprehensive directory platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/add-business"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  List Your Business Free
                </Link>
                <a
                  href="#premium"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Explore Premium
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalBusinesses}+</div>
                  <div className="text-sm text-blue-200">Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalCategories}+</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalCities}+</div>
                  <div className="text-sm text-blue-200">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.premiumBusinesses}+</div>
                  <div className="text-sm text-blue-200">Premium</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Why Business Owners Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span>Free basic listings for all businesses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span>Verified customer reviews and ratings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span>Local SEO optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span>Mobile-friendly customer experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span>Direct customer contact tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed Online
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools and features you need to attract customers, 
              build your reputation, and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                yellow: 'bg-yellow-100 text-yellow-600',
                purple: 'bg-purple-100 text-purple-600',
                red: 'bg-red-100 text-red-600',
                indigo: 'bg-indigo-100 text-indigo-600'
              };

              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Getting your business listed is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <a
                    href={step.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {step.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div id="premium" className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM FEATURES
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upgrade to Premium for Maximum Visibility
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take your business to the next level with premium features designed to increase 
              customer engagement and drive more business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {premiumFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-yellow-200 hover:border-yellow-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Go Premium?</h3>
              <p className="text-gray-600 mb-6">
                Contact us to learn about premium pricing and get your business featured today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${SITE_INFO.email}?subject=Premium Business Listing Inquiry`}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Sales
                </a>
                <a
                  href={`tel:${SITE_INFO.phone.replace(/[^\d+]/g, '')}`}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Business Owners Say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from real business owners who have grown their customer base with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.business}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.business}</div>
                    <div className="text-xs text-gray-500">{testimonial.category} • {testimonial.city}</div>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about listing your business
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful businesses already using our platform to connect with customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/add-business"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              List Your Business Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Our Team
            </Link>
          </div>

          <div className="text-blue-200 text-sm">
            Questions? Call us at <a href={`tel:${SITE_INFO.phone.replace(/[^\d+]/g, '')}`} className="text-white underline">{SITE_INFO.phone}</a> or 
            email <a href={`mailto:${SITE_INFO.email}`} className="text-white underline">{SITE_INFO.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOwnersPage;