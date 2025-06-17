import React, { useState } from 'react';
import { Settings, ChevronDown, RefreshCw } from 'lucide-react';

interface DevPanelProps {
  onSubdomainChange: (category: string, city: string) => void;
  currentCategory: string;
  currentCity: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const DevPanel: React.FC<DevPanelProps> = ({
  onSubdomainChange,
  currentCategory,
  currentCity,
  isVisible,
  onToggleVisibility
}) => {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedCity, setSelectedCity] = useState(currentCity);

  const categories = [
    'Nail Salons',
    'Auto Repair',
    'Hair Salons',
    'Restaurants'
  ];

  const cities = [
    'Dallas',
    'Denver', 
    'Austin',
    'Houston',
    'Phoenix',
    'Chicago',
    'Atlanta',
    'Miami',
    'Seattle',
    'Portland'
  ];

  const handleApplyChanges = () => {
    onSubdomainChange(selectedCategory, selectedCity);
  };

  const formatForUrl = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  const simulatedUrl = `${formatForUrl(selectedCategory)}.${formatForUrl(selectedCity)}.near-me.us`;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggleVisibility}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
        title="Toggle Development Panel"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-80 z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Development Panel</h3>
            <button
              onClick={onToggleVisibility}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="font-medium mb-1">Simulated URL:</div>
              <div className="font-mono text-xs break-all">{simulatedUrl}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City:
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleApplyChanges}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Apply Changes
            </button>
            
            <div className="text-xs text-gray-500 border-t pt-3">
              <div className="mb-1">Current Configuration:</div>
              <div>Category: <span className="font-medium">{currentCategory}</span></div>
              <div>City: <span className="font-medium">{currentCity}</span></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevPanel;