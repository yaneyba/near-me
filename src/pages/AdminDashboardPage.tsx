import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Building, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Search, 
  Filter, 
  ChevronDown, 
  Menu, 
  X,
  AlertTriangle,
  Clock,
  CheckCheck,
  Inbox,
  MailOpen,
  MailCheck,
  Trash2,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  ArrowUpDown,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  Bell
} from 'lucide-react';
import { DataProviderFactory } from '../providers/DataProviderFactory';
import { useAuth } from '../lib/auth';
import { Pagination } from '../components/Pagination';
import usePagination from '../hooks/usePagination';

const AdminDashboardPage = () => {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('business-submissions');
  
  // Data loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Business submissions state
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [submissionSearchQuery, setSubmissionSearchQuery] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('all');
  
  // Contact messages state
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');
  
  // Directory businesses state
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [businessStatusFilter, setBusinessStatusFilter] = useState('all');
  
  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // Settings state
  const [settings, setSettings] = useState({
    loginEnabled: true,
    trackingEnabled: true,
    adsEnabled: false
  });
  
  // Stats state
  const [stats, setStats] = useState({
    pendingBusinesses: 0,
    totalBusinesses: 0,
    newMessages: 0,
    totalUsers: 0,
    premiumBusinesses: 0
  });
  
  // Action states
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Pagination hooks
  const submissionsPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [submissionSearchQuery, submissionStatusFilter] 
  });
  
  const messagesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [messageSearchQuery, messageStatusFilter] 
  });
  
  const businessesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [businessSearchQuery, businessStatusFilter] 
  });
  
  const usersPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [userSearchQuery, userRoleFilter] 
  });

  const { user } = useAuth();
  const dataProvider = DataProviderFactory.getProvider();

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      window.location.href = '/';
    }
  }, [user]);

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Add debug helpers
    if (process.env.NODE_ENV === 'development') {
      window.debugAdminDashboard = {
        checkAuth: () => console.log('Current user:', user),
        loadData,
        showStats: () => console.log('Current stats:', stats)
      };
    }
    
    return () => {
      // Clean up debug helpers
      if (process.env.NODE_ENV === 'development' && window.debugAdminDashboard) {
        delete window.debugAdminDashboard;
      }
    };
  }, []);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [
        submissionsData, 
        messagesData, 
        businessesData, 
        usersData,
        statsData
      ] = await Promise.all([
        dataProvider.getBusinessSubmissions(),
        dataProvider.getContactMessages(),
        dataProvider.getAllBusinesses(),
        dataProvider.getBusinessProfiles(),
        dataProvider.getAdminStats()
      ]);
      
      // Update state with loaded data
      setBusinessSubmissions(submissionsData);
      setContactMessages(messagesData);
      setBusinesses(businessesData);
      setUsers(usersData);
      setStats(statsData);
      
      // Load settings
      loadSettings();
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      // In a real implementation, this would load from database
      // For now, we'll use environment variables as fallback
      setSettings({
        loginEnabled: true,
        trackingEnabled: true,
        adsEnabled: false
      });
    } catch (err) {
      console.error('Error loading settings:', err);
      // Don't set error state here to avoid blocking the UI
    }
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<typeof settings>) => {
    try {
      setProcessingAction('settings');
      
      // In a real implementation, this would update the database
      // For now, we'll just update local state
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      setActionSuccess('Settings updated successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating settings:', err);
      setActionError('Failed to update settings');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setProcessingAction(null);
    }
  };

  // Handle business submission approval
  const handleApproveSubmission = async (id: string) => {
    try {
      setProcessingAction(`approve-${id}`);
      
      await dataProvider.approveBusinessSubmission(id);
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status: 'approved', reviewed_at: new Date().toISOString() } : sub
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: Math.max(0, prev.pendingBusinesses - 1)
      }));
      
      setActionSuccess('Business approved successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Error approving business:', err);
      setActionError('Failed to approve business');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setProcessingAction(null);
    }
  };

  // Handle business submission rejection
  const handleRejectSubmission = async (id: string) => {
    try {
      setProcessingAction(`reject-${id}`);
      
      await dataProvider.rejectBusinessSubmission(id);
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status: 'rejected', reviewed_at: new Date().toISOString() } : sub
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: Math.max(0, prev.pendingBusinesses - 1)
      }));
      
      setActionSuccess('Business rejected successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Error rejecting business:', err);
      setActionError('Failed to reject business');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setProcessingAction(null);
    }
  };

  // Handle contact message resolution
  const handleResolveMessage = async (id: string) => {
    try {
      setProcessingAction(`resolve-${id}`);
      
      await dataProvider.resolveContactMessage(id, user?.email);
      
      // Update local state
      setContactMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, status: 'resolved', resolved_at: new Date().toISOString() } : msg
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        newMessages: Math.max(0, prev.newMessages - 1)
      }));
      
      setActionSuccess('Message resolved successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Error resolving message:', err);
      setActionError('Failed to resolve message');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setProcessingAction(null);
    }
  };

  // Filter business submissions
  const getFilteredSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Status filter
      if (submissionStatusFilter !== 'all' && submission.status !== submissionStatusFilter) {
        return false;
      }
      
      // Search filter
      if (submissionSearchQuery) {
        const query = submissionSearchQuery.toLowerCase();
        return (
          submission.business_name.toLowerCase().includes(query) ||
          submission.owner_name.toLowerCase().includes(query) ||
          submission.email.toLowerCase().includes(query) ||
          submission.city.toLowerCase().includes(query) ||
          submission.state.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  // Filter contact messages
  const getFilteredContactMessages = () => {
    return contactMessages.filter(message => {
      // Status filter
      if (messageStatusFilter !== 'all' && message.status !== messageStatusFilter) {
        return false;
      }
      
      // Search filter
      if (messageSearchQuery) {
        const query = messageSearchQuery.toLowerCase();
        return (
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  // Filter businesses
  const getFilteredBusinesses = () => {
    return businesses.filter(business => {
      // Status filter
      if (businessStatusFilter !== 'all') {
        if (businessStatusFilter === 'premium' && !business.premium) {
          return false;
        }
        if (businessStatusFilter === 'regular' && business.premium) {
          return false;
        }
        if (businessStatusFilter === 'verified' && !business.verified) {
          return false;
        }
      }
      
      // Search filter
      if (businessSearchQuery) {
        const query = businessSearchQuery.toLowerCase();
        return (
          business.name.toLowerCase().includes(query) ||
          business.category.toLowerCase().includes(query) ||
          business.city.toLowerCase().includes(query) ||
          business.state.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  // Filter users
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Role filter
      if (userRoleFilter !== 'all' && user.role !== userRoleFilter) {
        return false;
      }
      
      // Search filter
      if (userSearchQuery) {
        const query = userSearchQuery.toLowerCase();
        return (
          user.business_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'new':
        return <Inbox className="w-4 h-4" />;
      case 'in_progress':
        return <MailOpen className="w-4 h-4" />;
      case 'resolved':
        return <MailCheck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Error Loading Dashboard</h2>
          <p className="text-gray-600 mt-2 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get filtered data
  const filteredSubmissions = getFilteredSubmissions();
  const filteredMessages = getFilteredContactMessages();
  const filteredBusinesses = getFilteredBusinesses();
  const filteredUsers = getFilteredUsers();
  
  // Get paginated data
  const paginatedSubmissions = submissionsPagination.getPaginatedItems(filteredSubmissions);
  const paginatedMessages = messagesPagination.getPaginatedItems(filteredMessages);
  const paginatedBusinesses = businessesPagination.getPaginatedItems(filteredBusinesses);
  const paginatedUsers = usersPagination.getPaginatedItems(filteredUsers);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Building className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('business-submissions');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'business-submissions' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5 mr-3" />
                <span>Business Submissions</span>
                {stats.pendingBusinesses > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats.pendingBusinesses}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('contact-messages');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'contact-messages' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <span>Contact Messages</span>
                {stats.newMessages > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats.newMessages}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('businesses');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'businesses' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5 mr-3" />
                <span>Directory Businesses</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('users');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'users' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>User Management</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Bell className="w-4 h-4 mr-2" />
                <span>Notifications</span>
                <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.pendingBusinesses + stats.newMessages}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Building className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('business-submissions')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'business-submissions' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5 mr-3" />
                <span>Business Submissions</span>
                {stats.pendingBusinesses > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats.pendingBusinesses}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('contact-messages')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'contact-messages' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <span>Contact Messages</span>
                {stats.newMessages > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {stats.newMessages}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('businesses')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'businesses' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5 mr-3" />
                <span>Directory Businesses</span>
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'users' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>User Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Admin: {user?.email}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Last login: {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Action Messages */}
          {actionSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>{actionSuccess}</div>
            </div>
          )}
          
          {actionError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>{actionError}</div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Pending Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBusinesses}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-600">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-600">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">New Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newMessages}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-600">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-600">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Premium Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.premiumBusinesses}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Business Submissions Tab */}
          {activeTab === 'business-submissions' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Business Submissions</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={submissionSearchQuery}
                      onChange={(e) => setSubmissionSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-400 mr-2" />
                    <select
                      value={submissionStatusFilter}
                      onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600">
                  {filteredSubmissions.length} of {businessSubmissions.length} submissions
                  {submissionSearchQuery && ` matching "${submissionSearchQuery}"`}
                </div>
              </div>
              
              {/* Submissions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Owner
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Submitted
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      paginatedSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.business_name}
                            </div>
                            <div className="text-xs text-gray-500 md:hidden">
                              {submission.owner_name}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">{submission.owner_name}</div>
                            <div className="text-xs text-gray-500">{submission.email}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-gray-900">{submission.city}, {submission.state}</div>
                            <div className="text-xs text-gray-500">{submission.category}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1 capitalize">{submission.status}</span>
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {formatDate(submission.submitted_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {submission.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveSubmission(submission.id)}
                                    disabled={processingAction === `approve-${submission.id}`}
                                    className="text-green-600 hover:text-green-900 p-1"
                                    title="Approve"
                                  >
                                    {processingAction === `approve-${submission.id}` ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-5 h-5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleRejectSubmission(submission.id)}
                                    disabled={processingAction === `reject-${submission.id}`}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Reject"
                                  >
                                    {processingAction === `reject-${submission.id}` ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <XCircle className="w-5 h-5" />
                                    )}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {/* View details */}}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={submissionsPagination.currentPage}
                totalPages={submissionsPagination.getTotalPages(filteredSubmissions.length)}
                itemsPerPage={submissionsPagination.itemsPerPage}
                totalItems={filteredSubmissions.length}
                onPageChange={submissionsPagination.setCurrentPage}
              />
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === 'contact-messages' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-400 mr-2" />
                    <select
                      value={messageStatusFilter}
                      onChange={(e) => setMessageStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
                
                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600">
                  {filteredMessages.length} of {contactMessages.length} messages
                  {messageSearchQuery && ` matching "${messageSearchQuery}"`}
                </div>
              </div>
              
              {/* Messages Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Message
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Received
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedMessages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No messages found
                        </td>
                      </tr>
                    ) : (
                      paginatedMessages.map((message) => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {message.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {message.email}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {message.subject || 'No Subject'}
                            </div>
                            <div className="text-xs text-gray-500 md:hidden">
                              {truncateText(message.message, 30)}
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {truncateText(message.message, 100)}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(message.status)}`}>
                              {getStatusIcon(message.status)}
                              <span className="ml-1 capitalize">{message.status}</span>
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {formatDate(message.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {message.status !== 'resolved' && (
                                <button
                                  onClick={() => handleResolveMessage(message.id)}
                                  disabled={processingAction === `resolve-${message.id}`}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Mark as Resolved"
                                >
                                  {processingAction === `resolve-${message.id}` ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <CheckCheck className="w-5 h-5" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => {/* View details */}}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={messagesPagination.currentPage}
                totalPages={messagesPagination.getTotalPages(filteredMessages.length)}
                itemsPerPage={messagesPagination.itemsPerPage}
                totalItems={filteredMessages.length}
                onPageChange={messagesPagination.setCurrentPage}
              />
            </div>
          )}

          {/* Directory Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Directory Businesses</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={businessSearchQuery}
                      onChange={(e) => setBusinessSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-400 mr-2" />
                    <select
                      value={businessStatusFilter}
                      onChange={(e) => setBusinessStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Businesses</option>
                      <option value="premium">Premium Only</option>
                      <option value="regular">Regular Only</option>
                      <option value="verified">Verified Only</option>
                    </select>
                  </div>
                </div>
                
                {/* Results count and pagination info */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                  <div>
                    {filteredBusinesses.length} of {businesses.length} businesses
                    {businessSearchQuery && ` matching "${businessSearchQuery}"`}
                  </div>
                  
                  {businessesPagination.getTotalPages(filteredBusinesses.length) > 1 && (
                    <div>
                      Page {businessesPagination.currentPage} of {businessesPagination.getTotalPages(filteredBusinesses.length)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Businesses Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Added
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedBusinesses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No businesses found
                        </td>
                      </tr>
                    ) : (
                      paginatedBusinesses.map((business) => (
                        <tr key={business.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                                {business.image && (
                                  <img 
                                    src={business.image} 
                                    alt={business.name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {business.name}
                                </div>
                                <div className="text-xs text-gray-500 md:hidden">
                                  {business.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900 capitalize">
                              {business.category.replace(/-/g, ' ')}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-gray-900">{business.city}, {business.state}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                              {business.premium && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Premium
                                </span>
                              )}
                              {business.verified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Verified
                                </span>
                              )}
                              {!business.premium && !business.verified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Regular
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {formatDate(business.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {/* View details */}}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {/* Edit business */}}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {/* Delete business */}}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={businessesPagination.currentPage}
                totalPages={businessesPagination.getTotalPages(filteredBusinesses.length)}
                itemsPerPage={businessesPagination.itemsPerPage}
                totalItems={filteredBusinesses.length}
                onPageChange={businessesPagination.setCurrentPage}
              />
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray-400 mr-2" />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="owner">Business Owners</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>
                
                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600">
                  {filteredUsers.length} of {users.length} users
                  {userSearchQuery && ` matching "${userSearchQuery}"`}
                </div>
              </div>
              
              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Business
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-500 md:hidden">
                              {user.business_name || 'No business'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">
                              {user.business_name || 'No business'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Owner'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="flex items-center">
                              {user.premium ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Premium
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Regular
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {/* View details */}}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {/* Edit user */}}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {/* Delete user */}}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={usersPagination.currentPage}
                totalPages={usersPagination.getTotalPages(filteredUsers.length)}
                itemsPerPage={usersPagination.itemsPerPage}
                totalItems={filteredUsers.length}
                onPageChange={usersPagination.setCurrentPage}
              />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
              
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm font-medium text-gray-700">Select Date Range</div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      Today
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
                      Last 7 Days
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      Last 30 Days
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      Last 90 Days
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      Custom
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500">Page Views</div>
                    <div className="text-green-600 text-xs font-medium flex items-center">
                      <ArrowUpDown className="w-3 h-3 mr-1" />
                      12.5%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">24,521</div>
                  <div className="mt-4 h-10 bg-gray-100 rounded">
                    {/* Placeholder for chart */}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500">Business Views</div>
                    <div className="text-green-600 text-xs font-medium flex items-center">
                      <ArrowUpDown className="w-3 h-3 mr-1" />
                      8.3%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12,432</div>
                  <div className="mt-4 h-10 bg-gray-100 rounded">
                    {/* Placeholder for chart */}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                    <div className="text-red-600 text-xs font-medium flex items-center">
                      <ArrowUpDown className="w-3 h-3 mr-1" />
                      -2.1%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">3.2%</div>
                  <div className="mt-4 h-10 bg-gray-100 rounded">
                    {/* Placeholder for chart */}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-500">New Businesses</div>
                    <div className="text-green-600 text-xs font-medium flex items-center">
                      <ArrowUpDown className="w-3 h-3 mr-1" />
                      15.7%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">48</div>
                  <div className="mt-4 h-10 bg-gray-100 rounded">
                    {/* Placeholder for chart */}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic by Source</h3>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">User Login</div>
                      <div className="text-sm text-gray-600">Enable or disable user login functionality</div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateSettings({ loginEnabled: true })}
                        disabled={processingAction === 'settings' || settings.loginEnabled}
                        className={`px-3 py-1 rounded-l-lg text-sm font-medium ${
                          settings.loginEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Enabled
                      </button>
                      <button
                        onClick={() => updateSettings({ loginEnabled: false })}
                        disabled={processingAction === 'settings' || !settings.loginEnabled}
                        className={`px-3 py-1 rounded-r-lg text-sm font-medium ${
                          !settings.loginEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Settings</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">User Engagement Tracking</div>
                      <div className="text-sm text-gray-600">Enable or disable tracking of user interactions</div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateSettings({ trackingEnabled: true })}
                        disabled={processingAction === 'settings' || settings.trackingEnabled}
                        className={`px-3 py-1 rounded-l-lg text-sm font-medium ${
                          settings.trackingEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Enabled
                      </button>
                      <button
                        onClick={() => updateSettings({ trackingEnabled: false })}
                        disabled={processingAction === 'settings' || !settings.trackingEnabled}
                        className={`px-3 py-1 rounded-r-lg text-sm font-medium ${
                          !settings.trackingEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advertisement Settings</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Display Ads</div>
                      <div className="text-sm text-gray-600">Enable or disable advertisements on the site</div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateSettings({ adsEnabled: true })}
                        disabled={processingAction === 'settings' || settings.adsEnabled}
                        className={`px-3 py-1 rounded-l-lg text-sm font-medium ${
                          settings.adsEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Enabled
                      </button>
                      <button
                        onClick={() => updateSettings({ adsEnabled: false })}
                        disabled={processingAction === 'settings' || !settings.adsEnabled}
                        className={`px-3 py-1 rounded-r-lg text-sm font-medium ${
                          !settings.adsEnabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;