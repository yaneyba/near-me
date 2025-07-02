import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  AlertCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { DataProviderFactory } from '../providers';
import { useAuth, signOut } from '../lib/auth';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

const AdminDashboardPage: React.FC = () => {
  // Auth and navigation
  const { user, authFeatures } = useAuth();
  const navigate = useNavigate();
  
  // State for data
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingBusinesses: 0,
    totalBusinesses: 0,
    newMessages: 0,
    totalUsers: 0,
    premiumBusinesses: 0
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState<'businesses' | 'submissions' | 'messages' | 'users' | 'analytics' | 'settings'>('submissions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Settings state
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Pagination hooks
  const businessesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery, statusFilter] 
  });
  
  const submissionsPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery, statusFilter] 
  });
  
  const messagesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery, statusFilter] 
  });
  
  const usersPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery] 
  });

  // Load data on component mount
  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }
    
    loadData();
    
    // Add debug helpers to window object
    if (process.env.NODE_ENV === 'development') {
      (window as any).debugAdminDashboard = {
        checkAuth: () => console.log('Current user:', user),
        loadData,
        showStats: () => console.log('Current stats:', stats)
      };
    }
  }, [user]);

  // Load settings from auth features
  useEffect(() => {
    if (authFeatures) {
      setLoginEnabled(authFeatures.loginEnabled ?? true);
      setTrackingEnabled(authFeatures.trackingEnabled ?? true);
      setAdsEnabled(authFeatures.adsEnabled ?? false);
    }
  }, [authFeatures]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dataProvider = DataProviderFactory.getProvider();
      
      // Load all data in parallel
      const [
        submissionsData, 
        messagesData, 
        profilesData, 
        businessesData,
        statsData
      ] = await Promise.all([
        dataProvider.getBusinessSubmissions(),
        dataProvider.getContactMessages(),
        dataProvider.getBusinessProfiles(),
        dataProvider.getAllBusinesses(),
        dataProvider.getAdminStats()
      ]);
      
      // Update state with loaded data
      setBusinessSubmissions(submissionsData || []);
      setContactMessages(messagesData || []);
      setBusinessProfiles(profilesData || []);
      setBusinesses(businessesData || []);
      setStats(statsData);
      
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleApproveSubmission = async (id: string) => {
    try {
      setLoading(true);
      const dataProvider = DataProviderFactory.getProvider();
      await dataProvider.approveBusinessSubmission(id);
      
      // Update local data
      setBusinessSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status: 'approved', reviewed_at: new Date().toISOString() } : sub
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: Math.max(0, prev.pendingBusinesses - 1),
        totalBusinesses: prev.totalBusinesses + 1
      }));
      
      // Reload data to get the newly created business
      await loadData();
    } catch (err) {
      console.error('Error approving submission:', err);
      setError('Failed to approve submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmission = async (id: string) => {
    try {
      setLoading(true);
      const dataProvider = DataProviderFactory.getProvider();
      await dataProvider.rejectBusinessSubmission(id);
      
      // Update local data
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
    } catch (err) {
      console.error('Error rejecting submission:', err);
      setError('Failed to reject submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveMessage = async (id: string) => {
    try {
      setLoading(true);
      const dataProvider = DataProviderFactory.getProvider();
      await dataProvider.resolveContactMessage(id, user?.email);
      
      // Update local data
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
    } catch (err) {
      console.error('Error resolving message:', err);
      setError('Failed to resolve message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      
      // Update settings in database
      const dataProvider = DataProviderFactory.getProvider();
      await dataProvider.updateSettings({
        loginEnabled,
        trackingEnabled,
        adsEnabled
      });
      
      setSettingsChanged(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter functions
  const getFilteredBusinesses = () => {
    return businesses.filter(business => {
      // Search filter
      const matchesSearch = !searchQuery || 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'premium' && business.premium) ||
        (statusFilter === 'active' && business.status === 'active') ||
        (statusFilter === 'inactive' && business.status === 'inactive');
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Search filter
      const matchesSearch = !searchQuery || 
        submission.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && submission.status === 'pending') ||
        (statusFilter === 'approved' && submission.status === 'approved') ||
        (statusFilter === 'rejected' && submission.status === 'rejected');
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredMessages = () => {
    return contactMessages.filter(message => {
      // Search filter
      const matchesSearch = !searchQuery || 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'new' && message.status === 'new') ||
        (statusFilter === 'in_progress' && message.status === 'in_progress') ||
        (statusFilter === 'resolved' && message.status === 'resolved');
      
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredUsers = () => {
    return businessProfiles.filter(profile => {
      // Search filter
      return !searchQuery || 
        profile.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render loading state
  if (loading && !businessSubmissions.length && !contactMessages.length) {
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
  if (error && !businessSubmissions.length && !contactMessages.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your directory</p>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => { setActiveTab('submissions'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'submissions' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Business Submissions
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats.pendingBusinesses}
              </span>
            </button>
            
            <button
              onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'messages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Messages
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {stats.newMessages}
              </span>
            </button>
            
            <button
              onClick={() => { setActiveTab('businesses'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'businesses' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Directory Businesses
            </button>
            
            <button
              onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              User Management
            </button>
            
            <button
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </button>
            
            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
            
            <div className="border-t border-gray-200 my-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg flex items-center text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'submissions' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Business Submissions
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stats.pendingBusinesses}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'messages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Messages
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stats.newMessages}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'businesses' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Directory Businesses
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analytics
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </button>
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 pb-8">
            {/* Page header */}
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                      {activeTab === 'submissions' && 'Business Submissions'}
                      {activeTab === 'messages' && 'Contact Messages'}
                      {activeTab === 'businesses' && 'Directory Businesses'}
                      {activeTab === 'users' && 'User Management'}
                      {activeTab === 'analytics' && 'Analytics'}
                      {activeTab === 'settings' && 'Settings'}
                    </h2>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={loadData}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="hidden sm:inline">Refresh Data</span>
                      <span className="sm:hidden">Refresh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="px-4 sm:px-6 lg:px-8 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Businesses
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.pendingBusinesses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Businesses
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.totalBusinesses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <MessageSquare className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            New Messages
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.newMessages}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.totalUsers}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <BarChart3 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Premium Businesses
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.premiumBusinesses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="px-4 sm:px-6 lg:px-8 mt-6">
              {/* Business Submissions Tab */}
              {activeTab === 'submissions' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Business Submissions
                      </h3>
                      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search submissions..."
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                            {showFilters ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {showFilters && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'all'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setStatusFilter('pending')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => setStatusFilter('approved')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Approved
                        </button>
                        <button
                          onClick={() => setStatusFilter('rejected')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Rejected
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Business
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Submitted
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submissionsPagination.getPaginatedItems(getFilteredSubmissions()).map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{submission.business_name}</div>
                              <div className="text-sm text-gray-500 hidden sm:block">{submission.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{submission.owner_name}</div>
                              <div className="text-sm text-gray-500">{submission.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="text-sm text-gray-900">{submission.city}, {submission.state}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(submission.status)}`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {formatDate(submission.submitted_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {submission.status === 'pending' ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleApproveSubmission(submission.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectSubmission(submission.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  {submission.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {getFilteredSubmissions().length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                              No submissions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={submissionsPagination.currentPage}
                    totalPages={submissionsPagination.getTotalPages(getFilteredSubmissions().length)}
                    itemsPerPage={submissionsPagination.itemsPerPage}
                    totalItems={getFilteredSubmissions().length}
                    onPageChange={submissionsPagination.setCurrentPage}
                  />
                </div>
              )}

              {/* Contact Messages Tab */}
              {activeTab === 'messages' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Contact Messages
                      </h3>
                      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search messages..."
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                            {showFilters ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {showFilters && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'all'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setStatusFilter('new')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() => setStatusFilter('in_progress')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'in_progress'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => setStatusFilter('resolved')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Resolved
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            From
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Message
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Received
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {messagesPagination.getPaginatedItems(getFilteredMessages()).map((message) => (
                          <tr key={message.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{message.name}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{message.subject || 'No Subject'}</div>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <div className="text-sm text-gray-900 truncate max-w-xs">
                                {message.message.length > 100 
                                  ? message.message.substring(0, 100) + '...' 
                                  : message.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(message.status || 'new')}`}>
                                {message.status || 'new'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {formatDate(message.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {message.status !== 'resolved' ? (
                                <button
                                  onClick={() => handleResolveMessage(message.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              ) : (
                                <span className="text-gray-500">
                                  <Clock className="h-5 w-5" />
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {getFilteredMessages().length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                              No messages found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={messagesPagination.currentPage}
                    totalPages={messagesPagination.getTotalPages(getFilteredMessages().length)}
                    itemsPerPage={messagesPagination.itemsPerPage}
                    totalItems={getFilteredMessages().length}
                    onPageChange={messagesPagination.setCurrentPage}
                  />
                </div>
              )}

              {/* Directory Businesses Tab */}
              {activeTab === 'businesses' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Directory Businesses
                      </h3>
                      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search businesses..."
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                            {showFilters ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {showFilters && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'all'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setStatusFilter('active')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => setStatusFilter('inactive')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Inactive
                        </button>
                        <button
                          onClick={() => setStatusFilter('premium')}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusFilter === 'premium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Premium
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Business
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Added
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {businessesPagination.getPaginatedItems(getFilteredBusinesses()).map((business) => (
                          <tr key={business.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{business.name}</div>
                              <div className="text-sm text-gray-500 hidden sm:block">{business.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{business.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="text-sm text-gray-900">{business.city}, {business.state}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(business.status || 'active')}`}>
                                  {business.status || 'active'}
                                </span>
                                {business.premium && (
                                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Premium
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {formatDate(business.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => {
                                  // View business details
                                  console.log('View business:', business);
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                        {getFilteredBusinesses().length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                              No businesses found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={businessesPagination.currentPage}
                    totalPages={businessesPagination.getTotalPages(getFilteredBusinesses().length)}
                    itemsPerPage={businessesPagination.itemsPerPage}
                    totalItems={getFilteredBusinesses().length}
                    onPageChange={businessesPagination.setCurrentPage}
                  />
                </div>
              )}

              {/* User Management Tab */}
              {activeTab === 'users' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Management
                      </h3>
                      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search users..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Business
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Joined
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersPagination.getPaginatedItems(getFilteredUsers()).map((profile) => (
                          <tr key={profile.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{profile.email}</div>
                              <div className="text-sm text-gray-500">{profile.id.substring(0, 8)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-900">{profile.business_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                profile.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {profile.role || 'owner'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="flex items-center">
                                {profile.premium && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Premium
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {formatDate(profile.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => {
                                  // View user details
                                  console.log('View user:', profile);
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                        {getFilteredUsers().length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={usersPagination.currentPage}
                    totalPages={usersPagination.getTotalPages(getFilteredUsers().length)}
                    itemsPerPage={usersPagination.itemsPerPage}
                    totalItems={getFilteredUsers().length}
                    onPageChange={usersPagination.setCurrentPage}
                  />
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Analytics Dashboard
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      View performance metrics and trends
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Date Range</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input 
                              type="date" 
                              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input 
                              type="date" 
                              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Last 7 Days
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm font-medium">
                            Last 30 Days
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm font-medium">
                            Last 90 Days
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm font-medium">
                            This Year
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Period Selection</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                            Day
                          </button>
                          <button className="px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md text-sm font-medium">
                            Week
                          </button>
                          <button className="px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md text-sm font-medium">
                            Month
                          </button>
                          <button className="px-3 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md text-sm font-medium">
                            Year
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center justify-center h-64">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Chart placeholder - Analytics integration coming soon</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Total Views</h4>
                        <p className="text-2xl font-bold text-gray-900">12,543</p>
                        <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h4>
                        <p className="text-2xl font-bold text-gray-900">3.2%</p>
                        <p className="text-sm text-red-600 mt-1">-0.5% from last period</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Premium Conversions</h4>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-sm text-green-600 mt-1">+4 from last period</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      System Settings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure global application settings
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Authentication Settings */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Authentication Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">User Login</h5>
                            <p className="text-sm text-gray-500">Enable or disable user login functionality</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                            <input
                              type="checkbox"
                              id="toggle-login"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                              checked={loginEnabled}
                              onChange={() => {
                                setLoginEnabled(!loginEnabled);
                                setSettingsChanged(true);
                              }}
                            />
                            <label
                              htmlFor="toggle-login"
                              className="block h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">User Tracking</h5>
                            <p className="text-sm text-gray-500">Enable or disable user engagement tracking</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                            <input
                              type="checkbox"
                              id="toggle-tracking"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                              checked={trackingEnabled}
                              onChange={() => {
                                setTrackingEnabled(!trackingEnabled);
                                setSettingsChanged(true);
                              }}
                            />
                            <label
                              htmlFor="toggle-tracking"
                              className="block h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">Advertisements</h5>
                            <p className="text-sm text-gray-500">Enable or disable advertisements on the site</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                            <input
                              type="checkbox"
                              id="toggle-ads"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                              checked={adsEnabled}
                              onChange={() => {
                                setAdsEnabled(!adsEnabled);
                                setSettingsChanged(true);
                              }}
                            />
                            <label
                              htmlFor="toggle-ads"
                              className="block h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    {settingsChanged && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingSettings ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;