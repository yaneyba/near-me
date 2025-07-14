// Debug Water Refill Issue
// Let's create a simple test page to check what's happening

import React, { useState, useEffect } from 'react';
import { parseSubdomain } from '@/utils/subdomainParser';

const WaterRefillDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const subdomainInfo = parseSubdomain();
    setDebugInfo({
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      subdomainInfo,
      isWaterRefill: subdomainInfo?.isWaterRefill,
      category: subdomainInfo?.category,
      city: subdomainInfo?.city,
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Water Refill Debug</h1>
      <pre style={{ background: '#f5f5f5', padding: '10px' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <h2>Expected for water-refill.near-me.us:</h2>
      <ul>
        <li>isWaterRefill: true</li>
        <li>category: "Water Refill Stations"</li>
        <li>city: "All Cities"</li>
      </ul>
    </div>
  );
};

export default WaterRefillDebug;
