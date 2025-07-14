import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { parseSubdomain } from '@/utils/subdomainParser';
import { SubdomainInfo } from '@/types';
import { useAuth } from '@/lib/auth';

// Import the Smart Door system
import { SmartDoor } from '@/components/routing';

function App() {
  // Configure the data provider factory
  useEffect(() => {
    // Always use D1 data provider
    DataProviderFactory.configure({
      type: 'd1'
    });
    
    console.log('Data provider configured: d1 (D1 Database)');
  }, []);

  // Parse subdomain info once at app level
  const subdomainInfo: SubdomainInfo = parseSubdomain();
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.isAdmin && window.location.pathname === '/') {
      window.location.href = '/admin/dashboard';
    }
  }, [user]);

  return (
    <Router>
      {/* 🚪 The Smart Door decides which world to show */}
      <SmartDoor subdomainInfo={subdomainInfo} />
    </Router>
  );
}

export default App;