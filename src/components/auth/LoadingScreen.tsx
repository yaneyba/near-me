import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
        <p className="text-sm text-gray-500 mt-2">If this takes too long, please refresh the page.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;