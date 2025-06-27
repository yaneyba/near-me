import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { isUserAdmin } from '../lib/auth';

const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Settings - Near Me Directory';
    
    const checkAdmin = async () => {
      try {
        const admin = await isUserAdmin();
        
        if (!admin) {
          navigate('/', { replace: true });
        } else {
          // Redirect to admin dashboard with settings tab active
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/', { replace: true });
      }
    };
    
    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Admin Dashboard</h2>
        <p className="text-gray-600 mb-4">The settings page has been moved to the Admin Dashboard.</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;