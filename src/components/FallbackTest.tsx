import React, { useState } from 'react';
import { getAuthFeatureFlags, getAuthFeatureFlagsAsync, getEnvironmentFallbackSettings } from '../lib/auth';

export const FallbackTest: React.FC = () => {
  const [syncSettings, setSyncSettings] = useState<any>(null);
  const [asyncSettings, setAsyncSettings] = useState<any>(null);
  const [envSettings, setEnvSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSyncSettings = () => {
    try {
      const settings = getAuthFeatureFlags();
      setSyncSettings(settings);
    } catch (err) {
      setError(`Sync test failed: ${err}`);
    }
  };

  const testAsyncSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await getAuthFeatureFlagsAsync();
      setAsyncSettings(settings);
    } catch (err) {
      setError(`Async test failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testEnvSettings = () => {
    try {
      const settings = getEnvironmentFallbackSettings();
      setEnvSettings(settings);
    } catch (err) {
      setError(`Env test failed: ${err}`);
    }
  };

  const testLocalStorageClear = () => {
    try {
      localStorage.removeItem('auth_feature_flags');
      alert('localStorage cleared! Test sync settings again to see env fallback.');
    } catch (err) {
      setError(`localStorage clear failed: ${err}`);
    }
  };

  const testLocalStorageSet = () => {
    try {
      const testSettings = { loginEnabled: false, trackingEnabled: false };
      localStorage.setItem('auth_feature_flags', JSON.stringify(testSettings));
      alert('localStorage set to false values! Test sync settings again to see these values.');
    } catch (err) {
      setError(`localStorage set failed: ${err}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Fallback Logic Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Controls */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Controls</h2>
          
          <button
            onClick={testSyncSettings}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Sync Settings (localStorage → env)
          </button>
          
          <button
            onClick={testAsyncSettings}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Async Settings (DB → env)'}
          </button>
          
          <button
            onClick={testEnvSettings}
            className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Environment Settings
          </button>
          
          <hr className="my-4" />
          
          <button
            onClick={testLocalStorageClear}
            className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear localStorage
          </button>
          
          <button
            onClick={testLocalStorageSet}
            className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Set localStorage to False Values
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Environment Settings (VITE_* vars)</h3>
            <pre className="text-sm bg-white p-2 rounded border">
              {envSettings ? JSON.stringify(envSettings, null, 2) : 'Not tested yet'}
            </pre>
            <p className="text-xs text-gray-600 mt-1">
              Shows: loginEnabled, trackingEnabled, adsEnabled from environment variables
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Sync Settings (localStorage → env)</h3>
            <pre className="text-sm bg-white p-2 rounded border">
              {syncSettings ? JSON.stringify(syncSettings, null, 2) : 'Not tested yet'}
            </pre>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Async Settings (DB → env)</h3>
            <pre className="text-sm bg-white p-2 rounded border">
              {asyncSettings ? JSON.stringify(asyncSettings, null, 2) : 'Not tested yet'}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-medium mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>First, test Environment Settings to see the .env values</li>
          <li>Test Sync Settings - should match env (if localStorage is clear)</li>
          <li>Test Async Settings - should load from database or fallback to env</li>
          <li>Use "Set localStorage to False Values" to test localStorage priority</li>
          <li>Use "Clear localStorage" to test env fallback</li>
        </ol>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h3 className="font-medium mb-2">Current localStorage:</h3>
        <pre className="text-sm bg-white p-2 rounded border">
          {localStorage.getItem('auth_feature_flags') || 'empty'}
        </pre>
      </div>
    </div>
  );
};
