import React from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface AdminBadgeProps {
  className?: string;
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  // Only show badge if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className={`inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium ${className}`}>
      <Shield className="w-3 h-3 mr-1" />
      Admin
    </div>
  );
};

export default AdminBadge;