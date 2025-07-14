import React, { useEffect } from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users, Building, Globe, Mail } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  
  useEffect(() => {
    document.title = 'Terms of Service - Near Me Directory';
  }, []);

  const lastUpdated = "December 25, 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 mb-2">
              These terms govern your use of our directory platform and services.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Key Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Free to use</div>
                <div className="text-sm text-blue-700">Our directory service is free for consumers</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Accurate information</div>
                <div className="text-sm text-blue-700">Businesses must provide truthful listings</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Respectful use</div>
                <div className="text-sm text-blue-700">No spam, abuse, or harmful content</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">We moderate content</div>
                <div className="text-sm text-blue-700">We review and approve business listings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Scale className="w-6 h-6 mr-3 text-blue-600" />
              Acceptance of Terms
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                By accessing or using the Near Me Directory platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">Important</div>
                    <p className="text-sm text-yellow-800 mt-1">
                      These terms constitute a legally binding agreement between you and Near Me Directory. 
                      Please read them carefully before using our service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-blue-600" />
              Description of Service
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Near Me Directory is an online platform that connects consumers with local businesses. Our service includes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">For Consumers</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Search and browse local businesses</li>
                    <li>• View business information and reviews</li>
                    <li>• Contact businesses directly</li>
                    <li>• Access business hours and locations</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">For Businesses</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Create and manage business listings</li>
                    <li>• Showcase services and information</li>
                    <li>• Connect with potential customers</li>
                    <li>• Access premium features (paid)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts and Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              User Accounts and Registration
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-medium text-gray-900">Account Creation</div>
                  <div className="text-sm text-gray-600">
                    Some features require account creation. You must provide accurate, current, and complete information.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Account Security</div>
                  <div className="text-sm text-gray-600">
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Account Responsibility</div>
                  <div className="text-sm text-gray-600">
                    You are responsible for all activities that occur under your account.
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-red-500 bg-red-50 p-4">
                <h3 className="font-semibold text-red-900 mb-2">Account Restrictions</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• You must be at least 18 years old to create an account</li>
                  <li>• One account per person or business</li>
                  <li>• No sharing of account credentials</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Business Listings */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Building className="w-6 h-6 mr-3 text-blue-600" />
              Business Listings
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Listing Requirements</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Accurate Information</div>
                      <div className="text-sm text-gray-600">All business information must be current, accurate, and truthful</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Legitimate Business</div>
                      <div className="text-sm text-gray-600">Must be a real, operating business with a physical location or service area</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Proper Authorization</div>
                      <div className="text-sm text-gray-600">You must be authorized to represent the business</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Content</h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="text-sm text-red-800 space-y-2">
                    <li>• False, misleading, or deceptive information</li>
                    <li>• Illegal products or services</li>
                    <li>• Adult content or services</li>
                    <li>• Discriminatory practices or content</li>
                    <li>• Spam or irrelevant information</li>
                    <li>• Copyrighted material without permission</li>
                    <li>• Competitor bashing or negative content about others</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Process</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-3">
                    All business listings are subject to review and approval. We reserve the right to:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Approve, reject, or modify listings</li>
                    <li>• Request additional verification</li>
                    <li>• Remove listings that violate these terms</li>
                    <li>• Suspend or terminate accounts for violations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              User Conduct
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                You agree to use our Service responsibly and in compliance with all applicable laws. You may not:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Prohibited Activities</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Violate any laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                    <li>• Transmit harmful or malicious code</li>
                    <li>• Attempt to gain unauthorized access</li>
                    <li>• Interfere with service operation</li>
                    <li>• Create fake accounts or listings</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Content Restrictions</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• No spam or unsolicited communications</li>
                    <li>• No harassment or abusive content</li>
                    <li>• No false or misleading information</li>
                    <li>• No inappropriate or offensive material</li>
                    <li>• No content that violates privacy</li>
                    <li>• No automated data collection</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Intellectual Property
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Our Rights</h3>
                <p className="text-sm text-blue-800">
                  The Service, including its design, functionality, and content, is owned by Near Me Directory and protected by 
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Your Content</h3>
                <p className="text-sm text-green-800">
                  You retain ownership of content you submit but grant us a license to use, display, and distribute it 
                  as part of our Service. You represent that you have the right to grant this license.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Respect Others' Rights</h3>
                <p className="text-sm text-purple-800">
                  Do not submit content that infringes on others' intellectual property rights. We will respond to 
                  valid copyright infringement notices in accordance with applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              Privacy and Data Protection
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
                which is incorporated into these Terms by reference.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Key Privacy Points</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We collect minimal necessary information</li>
                  <li>• We don't sell your personal data</li>
                  <li>• You can request data deletion or correction</li>
                  <li>• We use industry-standard security measures</li>
                  <li>• Business listings may be publicly visible</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600">
                For complete details, please review our <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>.
              </p>
            </div>
          </section>

          {/* Disclaimers and Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-blue-600" />
              Disclaimers and Limitations
            </h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Service "As Is"</h3>
                <p className="text-sm text-yellow-800">
                  Our Service is provided "as is" without warranties of any kind. We don't guarantee that the Service will be 
                  uninterrupted, error-free, or meet your specific requirements.
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Third-Party Content</h3>
                <p className="text-sm text-orange-800">
                  Business listings and information are provided by third parties. We don't verify all information and aren't 
                  responsible for the accuracy, quality, or reliability of third-party content.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Limitation of Liability</h3>
                <p className="text-sm text-red-800">
                  To the maximum extent permitted by law, Near Me Directory shall not be liable for any indirect, incidental, 
                  special, or consequential damages arising from your use of the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-blue-600" />
              Termination
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-medium text-gray-900">Your Right to Terminate</div>
                  <div className="text-sm text-gray-600">
                    You may stop using our Service at any time. You can request account deletion by contacting us.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Our Right to Terminate</div>
                  <div className="text-sm text-gray-600">
                    We may suspend or terminate your access for violations of these Terms or for any reason with notice.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Effect of Termination</div>
                  <div className="text-sm text-gray-600">
                    Upon termination, your right to use the Service ceases, but certain provisions of these Terms survive.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Changes to These Terms
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We may update these Terms from time to time. When we do:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>We'll post the updated Terms on this page</li>
                <li>We'll update the "Last updated" date</li>
                <li>For material changes, we'll provide notice via email or site announcement</li>
                <li>Your continued use after changes constitutes acceptance of the new Terms</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  We encourage you to review these Terms periodically to stay informed of any updates.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Scale className="w-6 h-6 mr-3 text-blue-600" />
              Governing Law and Disputes
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-medium text-gray-900">Governing Law</div>
                  <div className="text-sm text-gray-600">
                    These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Dispute Resolution</div>
                  <div className="text-sm text-gray-600">
                    We encourage resolving disputes through direct communication. For formal disputes, 
                    the courts of Dallas County, Texas shall have exclusive jurisdiction.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Severability</div>
                  <div className="text-sm text-gray-600">
                    If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-3 text-blue-600" />
              Contact Us
            </h2>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-900">
                If you have questions about these Terms of Service, please{' '}
                <a href="/contact" className="text-blue-700 hover:text-blue-800 underline font-medium">
                  contact us
                </a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;