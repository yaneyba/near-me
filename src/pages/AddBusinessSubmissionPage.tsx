import React from 'react';
import Layout from '../components/Layout';
import BusinessSubmissionForm from '../components/BusinessSubmissionForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AddBusinessPage: React.FC = () => {
  return (
    <Layout subdomainInfo={{ city: '', state: '', category: '' }}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Add Your Business to Our Directory
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Submit your business for review and join thousands of local businesses 
              connecting with customers in your area. All submissions are reviewed 
              by our team before being published.
            </p>
          </div>

          {/* Submission Process */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works:</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Submit Your Info</h3>
                <p className="text-sm text-gray-600">
                  Fill out the form with your business details and contact information
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Admin Review</h3>
                <p className="text-sm text-gray-600">
                  Our team reviews your submission within 1-2 business days
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Go Live</h3>
                <p className="text-sm text-gray-600">
                  Once approved, your business appears in search results
                </p>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <BusinessSubmissionForm 
            onSuccess={() => {
              // Could redirect or show additional info
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Already have an account?
            </h3>
            <p className="text-blue-800 mb-4">
              If you're an existing business owner, you can manage your listing 
              and access premium features through your dashboard.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddBusinessPage;
