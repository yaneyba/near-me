import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ToggleLeft, ToggleRight, Save, AlertCircle, CheckCircle, Lock, Settings, ArrowLeft } from 'lucide-react';
import { getAuthFeatureFlags, setAuthFeatureFlags, isUserAdmin } from '../lib/auth';

const AdminSettingsPage: React.FC = () => {
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const admin = await isUserAdmin();
        setIsAdmin(admin);
        
        if (!admin) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/', { replace: true });
      }
    };
    
    const loadSettings = () => {
      const flags = getAuthFeatureFlags();
      setLoginEnabled(flags.loginEnabled);
      setLoading(false);
    };
    
    checkAdmin();
    loadSettings();
  }, [navigate]);

  const handleSaveSettings = () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      setAuthFeatureFlags({
        loginEnabled
      });
      
      setSuccess('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}
            
            <h2 className="text-lg font-medium text-gray-900 mb-4">Authentication Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">User Login</h3>
                    <p className="text-sm text-gray-500">
                      Allow users to log in to their accounts. When disabled, users will be redirected to the home page if they try to access the login page.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginEnabled(!loginEnabled)}
                  className={`${
                    loginEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span className="sr-only">Toggle login</span>
                  <span
                    className={`${
                      loginEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  >
                    {loginEnabled ? (
                      <ToggleRight className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Disabling login will prevent all users from accessing their accounts, including business owners.
                This should only be used for maintenance or security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;