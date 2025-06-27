import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, HelpCircle } from 'lucide-react';

const CheckoutCancelPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Checkout Cancelled - Near Me Directory';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-gray-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Checkout Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was not completed. No charges have been made to your account.
            If you have any questions or need assistance, please don't hesitate to contact us.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800">
                  If you encountered any issues during checkout or have questions about our premium services,
                  our support team is ready to assist you.
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;