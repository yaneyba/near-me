import React, { useState, useEffect } from 'react';
import { getAuthFeatureFlags, getAuthFeatureFlagsAsync } from '../lib/auth';

const SimpleSettingsTest: React.FC = () => {
  const [syncSettings, setSyncSettings] = useState<any>(null);
  const [asyncSettings, setAsyncSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSyncSettings = () => {
    try {
      console.log('Testing sync settings...');
      const settings = getAuthFeatureFlags();
      console.log('Sync settings result:', settings);
      setSyncSettings(settings);
    } catch (err: any) {
      console.error('Sync settings error:', err);
      setError(`Sync error: ${err.message}`);
    }
  };

  const testAsyncSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing async settings...');
      const settings = await getAuthFeatureFlagsAsync();
      console.log('Async settings result:', settings);
      setAsyncSettings(settings);
    } catch (err: any) {
      console.error('Async settings error:', err);
      setError(`Async error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testSyncSettings();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Simple Settings Test</h2>
      
      <div className="space-y-6">
        {/* Sync Settings */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-700 mb-2">Synchronous Settings (localStorage/env)</h3>
          <pre className="text-sm bg-white p-2 rounded overflow-auto">
            {JSON.stringify(syncSettings, null, 2)}
          </pre>
        </div>

        {/* Async Settings */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-green-700">Async Settings (database + fallback)</h3>
            <button
              onClick={testAsyncSettings}
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Async'}
            </button>
          </div>
          <pre className="text-sm bg-white p-2 rounded overflow-auto">
            {asyncSettings ? JSON.stringify(asyncSettings, null, 2) : 'Click "Test Async" to load'}
          </pre>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Sync settings should load immediately (from localStorage/env)</li>
            <li>Click "Test Async" to test database loading</li>
            <li>Check browser console for detailed logs</li>
            <li>Async should fallback to sync if database fails</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleSettingsTest;
