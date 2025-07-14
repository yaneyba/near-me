import React from 'react';

/**
 * Visual Flow Diagram Component
 * Shows how the Smart Door system routes users
 */
export const SmartDoorFlowDiagram: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🚪 Smart Door System Flow
      </h1>
      
      {/* User Input */}
      <div className="text-center mb-8">
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 inline-block">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">🌐 User Visits URL</h2>
          <div className="space-y-2 text-sm">
            <div className="bg-white px-3 py-1 rounded">water-refill.near-me.us</div>
            <div className="bg-white px-3 py-1 rounded">lawyers.dallas.near-me.us</div>
            <div className="bg-white px-3 py-1 rounded">services.near-me.us</div>
          </div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="text-center mb-8">
        <div className="text-4xl">⬇️</div>
      </div>

      {/* App.tsx */}
      <div className="text-center mb-8">
        <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 inline-block">
          <h2 className="text-xl font-semibold text-green-800 mb-2">📱 App.tsx</h2>
          <div className="text-sm space-y-1">
            <div>🔧 Configure Database</div>
            <div>🔍 parseSubdomain()</div>
            <div>🚪 Send to Smart Door</div>
          </div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="text-center mb-8">
        <div className="text-4xl">⬇️</div>
      </div>

      {/* Smart Door */}
      <div className="text-center mb-8">
        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6 inline-block">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-4">🚪 SMART DOOR</h2>
          <div className="text-sm space-y-2">
            <div className="bg-white px-3 py-2 rounded border">
              <code>if (subdomainInfo.isWaterRefill) → WaterRefillWorld</code>
            </div>
            <div className="bg-white px-3 py-2 rounded border">
              <code>if (subdomainInfo.isServices) → ServicesWorld</code>
            </div>
            <div className="bg-white px-3 py-2 rounded border">
              <code>else → BusinessWorld</code>
            </div>
          </div>
        </div>
      </div>

      {/* Three Arrows */}
      <div className="flex justify-center space-x-12 mb-8">
        <div className="text-4xl">⬇️</div>
        <div className="text-4xl">⬇️</div>
        <div className="text-4xl">⬇️</div>
      </div>

      {/* Three Worlds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Water World */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💧 Water World</h3>
          <div className="text-sm space-y-1">
            <div className="font-medium">water-refill.near-me.us</div>
            <div className="pl-2 space-y-1 text-gray-600">
              <div>/ → Home</div>
              <div>/stations → List</div>
              <div>/station/:id → Detail</div>
              <div>/:city → City</div>
            </div>
          </div>
        </div>

        {/* Services World */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">🌐 Services World</h3>
          <div className="text-sm space-y-1">
            <div className="font-medium">services.near-me.us</div>
            <div className="pl-2 space-y-1 text-gray-600">
              <div>/ → All Services</div>
              <div>/about → About</div>
              <div>/contact → Contact</div>
              <div>/add-business → Add</div>
            </div>
          </div>
        </div>

        {/* Business World */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">🏢 Business World</h3>
          <div className="text-sm space-y-1">
            <div className="font-medium">category.city.near-me.us</div>
            <div className="pl-2 space-y-1 text-gray-600">
              <div>/ → Category Home</div>
              <div>/about → About</div>
              <div>/contact → Contact</div>
              <div>/business → Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Example Flows */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Example User Journeys</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border-l-4 border-blue-400">
            <div className="font-semibold text-blue-800">Water Refill Journey:</div>
            <div className="text-sm text-gray-600 mt-1">
              User visits <code>water-refill.near-me.us</code> → Smart Door detects <code>isWaterRefill: true</code> → Routes to WaterRefillWorld → Shows water station pages
            </div>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-purple-400">
            <div className="font-semibold text-purple-800">Business Journey:</div>
            <div className="text-sm text-gray-600 mt-1">
              User visits <code>lawyers.dallas.near-me.us</code> → Smart Door detects <code>category: "Lawyers", city: "Dallas"</code> → Routes to BusinessWorld → Shows Dallas lawyers
            </div>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-green-400">
            <div className="font-semibold text-green-800">Services Journey:</div>
            <div className="text-sm text-gray-600 mt-1">
              User visits <code>services.near-me.us</code> → Smart Door detects <code>isServices: true</code> → Routes to ServicesWorld → Shows all available services
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">✨ Why This Is Brilliant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-green-700">🎯 Clear Separation</div>
            <div className="text-gray-600">Each world handles its own domain</div>
          </div>
          <div>
            <div className="font-semibold text-blue-700">🧠 Easy to Understand</div>
            <div className="text-gray-600">Logic is explicit and visual</div>
          </div>
          <div>
            <div className="font-semibold text-purple-700">🔧 Easy to Maintain</div>
            <div className="text-gray-600">Change one world without affecting others</div>
          </div>
          <div>
            <div className="font-semibold text-orange-700">📈 Scalable</div>
            <div className="text-gray-600">Add new worlds easily</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDoorFlowDiagram;
