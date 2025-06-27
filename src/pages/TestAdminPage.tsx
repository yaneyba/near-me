import React from 'react';

const TestAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Test Page</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This is a test admin page to verify routing is working.
          </p>
          <div className="mt-4 space-y-2">
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Current Path:</strong> {window.location.pathname}</p>
            <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminPage;
