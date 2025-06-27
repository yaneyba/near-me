import React, { useState, useEffect } from 'react';
import { useAuth, getSettingsFromDatabase, updateDatabaseSettings, setAuthFeatureFlags } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Settings, Shield, Eye, Database, Wifi } from 'lucide-react';

const AdminSettingsTest: React.FC = () => {
  const { user, authFeatures } = useAuth();
  const [dbSettings, setDbSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [directDbTest, setDirectDbTest] = useState<any>(null);

  // Test direct Supabase access
  const testDirectSupabase = async () => {
    setLoading(true);
    try {
      console.log('Testing direct Supabase access...');
      
      // Import supabase dynamically to avoid lint error
      const { supabase } = await import('../lib/supabase');
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .in('key', ['login_enabled', 'tracking_enabled']);
      
      console.log('Direct Supabase result:', { data, error });
      setDirectDbTest({ data, error });
      
      if (error) {
        setError(`Direct Supabase error: ${error.message}`);
      } else {
        setUpdateStatus(`Direct Supabase success: Found ${data?.length || 0} settings`);
      }
    } catch (err: any) {
      console.error('Direct Supabase error:', err);
      setError(`Direct Supabase error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test reading settings from database
  const testDatabaseRead = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing database read...');
      const settings = await getSettingsFromDatabase();
      console.log('Database settings result:', settings);
      setDbSettings(settings);
      setUpdateStatus('Successfully read from database');
    } catch (err: any) {
      console.error('Database read error:', err);
      setError(`Database read error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test updating settings in database (admin only)
  const testDatabaseUpdate = async (key: 'loginEnabled' | 'trackingEnabled', value: boolean) => {
    if (user?.role !== 'admin') {
      setError('Only admin users can update settings');
      return;
    }

    setLoading(true);
    setUpdateStatus(null);
    try {
      const success = await updateDatabaseSettings({ [key]: value });
      if (success) {
        setUpdateStatus(`Successfully updated ${key} to ${value}`);
        // Re-read settings to confirm
        await testDatabaseRead();
      } else {
        setError(`Failed to update ${key}`);
      }
    } catch (err: any) {
      setError(`Update error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test localStorage update (simulates admin setting via UI)
  const testLocalStorageUpdate = (loginEnabled: boolean, trackingEnabled: boolean) => {
    setAuthFeatureFlags({ loginEnabled, trackingEnabled });
    setUpdateStatus(`Updated localStorage: login=${loginEnabled}, tracking=${trackingEnabled}`);
  };

  useEffect(() => {
    testDatabaseRead();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 mr-2 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings Test Dashboard</h2>
      </div>

      {/* User Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Current User</h3>
        <p>Email: {user?.email || 'Not logged in'}</p>
        <p>Role: {user?.role || 'None'}</p>
        <p className={`font-medium ${user?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
          {user?.role === 'admin' ? '✅ Admin (can update settings)' : '❌ Not admin (read-only)'}
        </p>
      </div>

      {/* Current Auth Features (from useAuth hook) */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
          <Wifi className="w-4 h-4 mr-2" />
          Current Auth Features (from useAuth hook)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-600" />
            <span>Login Enabled: </span>
            <span className={`ml-2 font-medium ${authFeatures?.loginEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {authFeatures?.loginEnabled ? 'True' : 'False'}
            </span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-blue-600" />
            <span>Tracking Enabled: </span>
            <span className={`ml-2 font-medium ${authFeatures?.trackingEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {authFeatures?.trackingEnabled ? 'True' : 'False'}
            </span>
          </div>
        </div>
      </div>

      {/* Database Settings */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-green-700 flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Database Settings (direct read)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={testDirectSupabase}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Direct Test'}
            </button>
            <button
              onClick={testDatabaseRead}
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Auth Test'}
            </button>
          </div>
        </div>
        
        {dbSettings ? (
          <div>
            <h4 className="font-medium text-green-700 mb-2">Auth Function Result:</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                <span>Login Enabled: </span>
                <span className={`ml-2 font-medium ${dbSettings.loginEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {dbSettings.loginEnabled ? 'True' : 'False'}
                </span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2 text-green-600" />
                <span>Tracking Enabled: </span>
                <span className={`ml-2 font-medium ${dbSettings.trackingEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {dbSettings.trackingEnabled ? 'True' : 'False'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Click test buttons to load database settings</p>
        )}
        
        {directDbTest && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h4 className="font-medium text-gray-700 mb-2">Direct Supabase Result:</h4>
            <pre className="text-xs overflow-auto">{JSON.stringify(directDbTest, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-700 mb-4">Test Controls</h3>
        
        {/* Database Update Tests (Admin Only) */}
        {user?.role === 'admin' ? (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Database Updates (Admin Only)</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => testDatabaseUpdate('loginEnabled', !dbSettings?.loginEnabled)}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Toggle Login ({dbSettings?.loginEnabled ? 'Disable' : 'Enable'})
              </button>
              <button
                onClick={() => testDatabaseUpdate('trackingEnabled', !dbSettings?.trackingEnabled)}
                disabled={loading}
                className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                Toggle Tracking ({dbSettings?.trackingEnabled ? 'Disable' : 'Enable'})
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-red-100 rounded text-red-700">
            <p>Database updates require admin role. Please log in as admin to test updates.</p>
          </div>
        )}

        {/* LocalStorage Tests */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">LocalStorage Override Tests</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => testLocalStorageUpdate(false, true)}
              className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              Disable Login Only
            </button>
            <button
              onClick={() => testLocalStorageUpdate(true, false)}
              className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              Disable Tracking Only
            </button>
            <button
              onClick={() => testLocalStorageUpdate(false, false)}
              className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Disable Both
            </button>
            <button
              onClick={() => testLocalStorageUpdate(true, true)}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Enable Both
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <p>{error}</p>
        </div>
      )}

      {updateStatus && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700">
          <p>{updateStatus}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">How to Test</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Check that "Current Auth Features" and "Database Settings" show the same values</li>
          <li>If admin: Try toggling settings with database update buttons</li>
          <li>Test localStorage overrides to see immediate UI changes</li>
          <li>Refresh the page to see if database settings persist</li>
          <li>Check browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSettingsTest;
