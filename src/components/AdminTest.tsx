import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Server, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Lock,
  User,
  Key
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const AdminTest: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [userDetails, setUserDetails] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      runAdminTests();
      fetchUserDetails();
    } else {
      setLoading(false);
      setError('Not authenticated as admin. Please log in with admin credentials.');
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserDetails({
          id: session.user.id,
          email: session.user.email,
          role: user?.role || 'unknown',
          isAdmin: user?.isAdmin || false,
          lastSignIn: new Date(session.user.last_sign_in_at || '').toLocaleString(),
          metadata: session.user.user_metadata
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const runAdminTests = async () => {
    setLoading(true);
    setError(null);
    const results: Record<string, boolean> = {};

    try {
      // Test 1: Check if user is admin
      results.isAdmin = user?.isAdmin || false;

      // Test 2: Test business_submissions table access
      try {
        const { data, error } = await supabase
          .from('business_submissions')
          .select('count')
          .limit(1);
        
        results.businessSubmissionsAccess = !error;
      } catch {
        results.businessSubmissionsAccess = false;
      }

      // Test 3: Test admin_settings table access
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('count')
          .limit(1);
        
        results.adminSettingsAccess = !error;
      } catch {
        results.adminSettingsAccess = false;
      }

      // Test 4: Test contact_messages table access
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('count')
          .limit(1);
        
        results.contactMessagesAccess = !error;
      } catch {
        results.contactMessagesAccess = false;
      }

      // Test 5: Test business_profiles table access
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('count')
          .limit(1);
        
        results.businessProfilesAccess = !error;
      } catch {
        results.businessProfilesAccess = false;
      }

      setTestResults(results);
      
      // Check if any tests failed
      const failedTests = Object.values(results).filter(result => !result).length;
      if (failedTests > 0) {
        setError(`${failedTests} admin permission tests failed. You may not have full admin access.`);
      }
    } catch (error: any) {
      setError(`Error running admin tests: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Running Admin Tests</h2>
            <p className="text-gray-600 text-center">
              Verifying your admin permissions and database access...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Admin System Test</h1>
                <p className="text-blue-100">Verify admin permissions and database access</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-red-700">{error}</div>
              </div>
            )}

            {!user?.isAdmin && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <Lock className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Admin Access Required</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This page is for testing admin functionality. You need admin privileges to run these tests.
                  </p>
                </div>
              </div>
            )}

            {/* User Details */}
            {userDetails && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  User Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-mono text-sm">{userDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">
                        {userDetails.role}
                        {userDetails.isAdmin && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Sign In</p>
                      <p className="font-medium">{userDetails.lastSignIn}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test Results */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Admin Permission Tests
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-gray-900">Admin Role</span>
                    </div>
                    {testResults.isAdmin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-gray-900">Business Submissions Access</span>
                    </div>
                    {testResults.businessSubmissionsAccess ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-gray-900">Admin Settings Access</span>
                    </div>
                    {testResults.adminSettingsAccess ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-gray-900">Contact Messages Access</span>
                    </div>
                    {testResults.contactMessagesAccess ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Server className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-gray-900">Business Profiles Access</span>
                    </div>
                    {testResults.businessProfilesAccess ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={runAdminTests}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Server className="w-4 h-4 mr-2" />
                Run Tests Again
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Shield className="w-4 h-4 mr-2" />
                Go to Admin Dashboard
              </button>
            </div>

            {/* Debug Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Debug Information</h3>
                <button
                  onClick={() => {
                    console.log('User Details:', userDetails);
                    console.log('Test Results:', testResults);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Log to Console
                </button>
              </div>
              <div className="bg-gray-100 rounded-md p-4 overflow-auto max-h-40">
                <pre className="text-xs text-gray-800">
                  {JSON.stringify({ userDetails, testResults }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;