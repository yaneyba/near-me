import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Database, Users, Mail, Phone, MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - Near Me Directory';
  }, []);

  const lastUpdated = "December 25, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-2">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Quick Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">We collect minimal data</div>
                <div className="text-sm text-blue-700">Only what's necessary for our services</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">We don't sell your data</div>
                <div className="text-sm text-blue-700">Your information stays with us</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">You control your data</div>
                <div className="text-sm text-blue-700">Request deletion or updates anytime</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Secure storage</div>
                <div className="text-sm text-blue-700">Industry-standard encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-blue-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Information You Provide</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Contact Information</div>
                      <div className="text-sm text-gray-600">Name, email address, phone number when you contact us or submit a business listing</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Business Information</div>
                      <div className="text-sm text-gray-600">Business name, address, services, hours, and description when you submit a business listing</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Communication Data</div>
                      <div className="text-sm text-gray-600">Messages, inquiries, and feedback you send through our contact forms</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect Automatically</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Usage Information</div>
                      <div className="text-sm text-gray-600">Pages visited, search queries, time spent on site, and interaction patterns</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Technical Information</div>
                      <div className="text-sm text-gray-600">IP address, browser type, device information, and operating system</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Location Data</div>
                      <div className="text-sm text-gray-600">General location based on IP address to show relevant local businesses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              How We Use Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Service Provision</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Display business listings and information</li>
                  <li>• Process contact form submissions</li>
                  <li>• Respond to your inquiries</li>
                  <li>• Facilitate business-customer connections</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Service Improvement</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Analyze usage patterns and preferences</li>
                  <li>• Improve search functionality</li>
                  <li>• Enhance user experience</li>
                  <li>• Develop new features</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Communication</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Send service-related notifications</li>
                  <li>• Respond to support requests</li>
                  <li>• Share important updates</li>
                  <li>• Process business applications</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Legal Compliance</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Comply with legal obligations</li>
                  <li>• Protect against fraud and abuse</li>
                  <li>• Enforce our terms of service</li>
                  <li>• Respond to legal requests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-blue-600" />
              Information Sharing and Disclosure
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-semibold text-green-900 mb-2">We DO NOT sell your personal information</h3>
                <p className="text-sm text-green-800">
                  We never sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">We may share information in these limited circumstances:</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">Service Providers</div>
                    <div className="text-sm text-gray-600">Trusted third parties who help us operate our service (hosting, analytics, email delivery)</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Business Listings</div>
                    <div className="text-sm text-gray-600">Business information you submit may be displayed publicly on our platform</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Legal Requirements</div>
                    <div className="text-sm text-gray-600">When required by law, court order, or to protect our rights and safety</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Business Transfers</div>
                    <div className="text-sm text-gray-600">In the event of a merger, acquisition, or sale of assets</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              Data Security
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Encryption</div>
                    <div className="text-sm text-gray-600">Data encrypted in transit and at rest</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Access Controls</div>
                    <div className="text-sm text-gray-600">Limited access on a need-to-know basis</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Secure Storage</div>
                    <div className="text-sm text-gray-600">Data stored on secure, monitored servers</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Regular Audits</div>
                    <div className="text-sm text-gray-600">Ongoing security assessments and updates</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Your Rights and Choices
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                You have the following rights regarding your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Access & Portability</h3>
                  <p className="text-sm text-blue-800">
                    Request a copy of your personal information and receive it in a portable format.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Correction</h3>
                  <p className="text-sm text-green-800">
                    Update or correct inaccurate personal information we have about you.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Deletion</h3>
                  <p className="text-sm text-purple-800">
                    Request deletion of your personal information, subject to legal requirements.
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Opt-Out</h3>
                  <p className="text-sm text-orange-800">
                    Opt out of certain data processing activities or marketing communications.
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">To exercise your rights:</div>
                    <p className="text-sm text-yellow-800 mt-1">
                      Contact us at <a href="mailto:privacy@near-me.us" className="underline">privacy@near-me.us</a> or use our contact form. 
                      We'll respond within 30 days and may need to verify your identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-blue-600" />
              Cookies and Tracking Technologies
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We use cookies and similar technologies to improve your experience:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-medium text-gray-900">Essential Cookies</div>
                  <div className="text-sm text-gray-600">Required for basic site functionality and security</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Analytics Cookies</div>
                  <div className="text-sm text-gray-600">Help us understand how visitors use our site to improve performance</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Preference Cookies</div>
                  <div className="text-sm text-gray-600">Remember your settings and preferences for a better experience</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                You can control cookies through your browser settings. Note that disabling certain cookies may affect site functionality.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              Children's Privacy
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information 
                from a child under 13, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Changes to This Privacy Policy
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. When we do:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>We'll post the updated policy on this page</li>
                <li>We'll update the "Last updated" date at the top</li>
                <li>For significant changes, we'll notify you via email or site notice</li>
                <li>Your continued use of our service constitutes acceptance of the updated policy</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-3 text-blue-600" />
              Contact Us
            </h2>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-900 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Email</div>
                    <a href="mailto:privacy@near-me.us" className="text-blue-700 hover:text-blue-800 underline">
                      privacy@near-me.us
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Phone</div>
                    <a href="tel:+15551234567" className="text-blue-700 hover:text-blue-800">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Address</div>
                    <div className="text-blue-700">
                      Near Me Directory<br />
                      Privacy Department<br />
                      123 Business Ave<br />
                      Dallas, TX 75201
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;