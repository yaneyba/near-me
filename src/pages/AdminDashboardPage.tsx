import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  AlertCircle,
  Flag,
  UserCheck,
  UserX,
  Beaker
} from 'lucide-react';
import { DataProviderFactory } from '../providers/DataProviderFactory';
import { updateDatabaseSettings, useAuth } from '../lib/auth';
import AdminTest from '../components/AdminTest';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'messages' | 'users' | 'analytics' | 'settings' | 'test'>('businesses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingBusinesses: 0,
    totalBusinesses: 0,
    newMessages: 0,
    totalUsers: 0,
    premiumBusinesses: 0
  });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state for businesses
  const [businessesPage, setBusinessesPage] = useState(1);
  const [businessesPerPage, setBusinessesPerPage] = useState(10);
  
  // Settings state
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getProvider();

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    
    loadData();
    loadSettings();
  }, [user, navigate]);

  // Reset pagination when filters change
  useEffect(() => {
    setBusinessesPage(1);
  }, [searchQuery, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [
        submissionsData,
        messagesData,
        profilesData,
        statsData
      ] = await Promise.all([
        dataProvider.getBusinessSubmissions(),
        dataProvider.getContactMessages(),
        dataProvider.getBusinessProfiles(),
        dataProvider.getAdminStats()
      ]);
      
      setBusinessSubmissions(submissionsData || []);
      setContactMessages(messagesData || []);
      setBusinessProfiles(profilesData || []);
      setStats(statsData || {
        pendingBusinesses: 0,
        totalBusinesses: 0,
        newMessages: 0,
        totalUsers: 0,
        premiumBusinesses: 0
      });
    } catch (err: any) {
      console.error('Error loading admin data:', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      // Get auth feature flags
      const { authFeatures } = useAuth();
      setLoginEnabled(authFeatures?.loginEnabled ?? true);
      setTrackingEnabled(authFeatures?.trackingEnabled ?? true);
      setAdsEnabled(authFeatures?.adsEnabled ?? false);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleApproveBusinessSubmission = async (id: string) => {
    try {
      await dataProvider.approveBusinessSubmission(id);
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { ...submission, status: 'approved', reviewed_at: new Date().toISOString() } 
            : submission
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: Math.max(0, prev.pendingBusinesses - 1),
        totalBusinesses: prev.totalBusinesses + 1
      }));
    } catch (err: any) {
      console.error('Error approving business submission:', err);
      alert(`Failed to approve business: ${err.message || 'Unknown error'}`);
    }
  };

  const handleRejectBusinessSubmission = async (id: string) => {
    try {
      await dataProvider.rejectBusinessSubmission(id);
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { ...submission, status: 'rejected', reviewed_at: new Date().toISOString() } 
            : submission
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: Math.max(0, prev.pendingBusinesses - 1)
      }));
    } catch (err: any) {
      console.error('Error rejecting business submission:', err);
      alert(`Failed to reject business: ${err.message || 'Unknown error'}`);
    }
  };

  const handleResolveContactMessage = async (id: string) => {
    try {
      await dataProvider.resolveContactMessage(id, user?.email);
      
      // Update local state
      setContactMessages(prev => 
        prev.map(message => 
          message.id === id 
            ? { 
                ...message, 
                status: 'resolved', 
                resolved_at: new Date().toISOString(),
                resolved_by: user?.email
              } 
            : message
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        newMessages: Math.max(0, prev.newMessages - 1)
      }));
    } catch (err: any) {
      console.error('Error resolving contact message:', err);
      alert(`Failed to resolve message: ${err.message || 'Unknown error'}`);
    }
  };

  const handleUpdateSettings = async () => {
    setSettingsLoading(true);
    try {
      // Update auth feature flags
      await updateDatabaseSettings({
        loginEnabled,
        trackingEnabled,
        adsEnabled
      });
      alert('Settings updated successfully');
    } catch (err: any) {
      console.error('Error updating settings:', err);
      alert(`Failed to update settings: ${err.message || 'Unknown error'}`);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filter functions
  const getFilteredBusinessSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Filter by status
      if (statusFilter !== 'all' && submission.status !== statusFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          submission.business_name?.toLowerCase().includes(query) ||
          submission.owner_name?.toLowerCase().includes(query) ||
          submission.email?.toLowerCase().includes(query) ||
          submission.city?.toLowerCase().includes(query)
        );
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by submitted_at date
      const dateA = new Date(a.submitted_at || 0).getTime();
      const dateB = new Date(b.submitted_at || 0).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const getFilteredContactMessages = () => {
    return contactMessages.filter(message => {
      // Filter by status
      if (statusFilter !== 'all' && message.status !== statusFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          message.name?.toLowerCase().includes(query) ||
          message.email?.toLowerCase().includes(query) ||
          message.subject?.toLowerCase().includes(query) ||
          message.message?.toLowerCase().includes(query)
        );
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by created_at date
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const getFilteredBusinesses = () => {
    return businessProfiles.filter(profile => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          profile.business_name?.toLowerCase().includes(query) ||
          profile.email?.toLowerCase().includes(query)
        );
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by created_at date
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  // Pagination functions
  const getPaginatedBusinesses = () => {
    const filtered = getFilteredBusinesses();
    const startIndex = (businessesPage - 1) * businessesPerPage;
    const endIndex = startIndex + businessesPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalBusinessesPages = () => {
    const filtered = getFilteredBusinesses();
    return Math.ceil(filtered.length / businessesPerPage);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
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

  // Debug helpers (for development only)
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    window.debugAdminDashboard = {
      checkAuth: () => console.log('Current user:', user),
      loadData: () => {
        console.log('Manually loading data...');
        loadData();
      },
      showStats: () => console.log('Current stats:', stats)
    };
  }

  if (loading && !businessSubmissions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Admin Dashboard</h2>
          <p className="text-gray-500 mt-2">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage business submissions, messages, and settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBusinesses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newMessages}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Premium Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.premiumBusinesses}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('businesses')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'businesses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Business Submissions
              </button>
              
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Contact Messages
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Directory Businesses
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </button>
              
              <button
                onClick={() => setActiveTab('test')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'test'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Beaker className="w-5 h-5 inline mr-2" />
                Test
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Business Submissions Tab */}
          {activeTab === 'businesses' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Business Submissions</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  {/* Sort Direction */}
                  <button
                    onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortDirection === 'desc' ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Newest First
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Oldest First
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Results Count */}
              <div className="text-sm text-gray-500 mb-4">
                Showing {getFilteredBusinessSubmissions().length} submissions
                {searchQuery && ` matching "${searchQuery}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredBusinessSubmissions().map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{submission.business_name}</div>
                          <div className="text-sm text-gray-500">{submission.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{submission.owner_name}</div>
                          <div className="text-sm text-gray-500">{submission.email}</div>
                          <div className="text-sm text-gray-500">{submission.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{submission.city}, {submission.state}</div>
                          <div className="text-sm text-gray-500">{submission.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(submission.status)}`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(submission.submitted_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {submission.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveBusinessSubmission(submission.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <UserCheck className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRejectBusinessSubmission(submission.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <UserX className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">
                              {submission.status === 'approved' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {getFilteredBusinessSubmissions().length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No business submissions found</h3>
                  <p className="text-gray-500">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Business submissions will appear here when they are submitted'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  {/* Sort Direction */}
                  <button
                    onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortDirection === 'desc' ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Newest First
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Oldest First
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Results Count */}
              <div className="text-sm text-gray-500 mb-4">
                Showing {getFilteredContactMessages().length} messages
                {searchQuery && ` matching "${searchQuery}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredContactMessages().map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{message.subject}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{message.city || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{message.category || 'General'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(message.status)}`}>
                            {message.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(message.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {message.status !== 'resolved' ? (
                            <button
                              onClick={() => handleResolveContactMessage(message.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="text-gray-500">
                              <Clock className="w-5 h-5" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty State */}
              {getFilteredContactMessages().length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contact messages found</h3>
                  <p className="text-gray-500">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Contact messages will appear here when they are submitted'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Directory Businesses Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Directory Businesses</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {getFilteredBusinesses().length} of {businessProfiles.length} businesses
                    {businessesPage > 1 && ` • Page ${businessesPage} of ${getTotalBusinessesPages()}`}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                  
                  {/* Sort Direction */}
                  <button
                    onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortDirection === 'desc' ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Newest First
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Oldest First
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedBusinesses().map((profile) => (
                      <tr key={profile.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{profile.business_name}</div>
                          <div className="text-sm text-gray-500">{profile.business_id || 'No ID'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{profile.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">owner(role)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            profile.premium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {profile.premium ? 'Premium' : 'Basic'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(profile.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {getTotalBusinessesPages() > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setBusinessesPage(prev => Math.max(prev - 1, 1))}
                      disabled={businessesPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setBusinessesPage(prev => Math.min(prev + 1, getTotalBusinessesPages()))}
                      disabled={businessesPage === getTotalBusinessesPages()}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(businessesPage - 1) * businessesPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(businessesPage * businessesPerPage, getFilteredBusinesses().length)}
                        </span>{' '}
                        of <span className="font-medium">{getFilteredBusinesses().length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setBusinessesPage(prev => Math.max(prev - 1, 1))}
                          disabled={businessesPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronUp className="h-5 w-5 rotate-90" />
                        </button>
                        
                        {/* Page numbers */}
                        {[...Array(getTotalBusinessesPages())].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setBusinessesPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              businessesPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setBusinessesPage(prev => Math.min(prev + 1, getTotalBusinessesPages()))}
                          disabled={businessesPage === getTotalBusinessesPages()}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronDown className="h-5 w-5 rotate-90" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {getFilteredBusinesses().length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? 'Try adjusting your search criteria'
                      : 'Businesses will appear here when they are created'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Date Range */}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  
                  {/* Period */}
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="day">By Day</option>
                    <option value="week">By Week</option>
                    <option value="month">By Month</option>
                  </select>
                </div>
              </div>
              
              {/* Analytics Placeholder */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We're working on comprehensive analytics for your admin dashboard. 
                  This feature will be available in an upcoming update.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              </div>
              
              <div className="space-y-6">
                {/* Authentication Settings */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Authentication Settings</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">User Login</h4>
                        <p className="text-sm text-gray-500">Allow users to log in to the platform</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id="toggle-login"
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                          checked={loginEnabled}
                          onChange={(e) => setLoginEnabled(e.target.checked)}
                        />
                        <label
                          htmlFor="toggle-login"
                          className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">User Engagement Tracking</h4>
                        <p className="text-sm text-gray-500">Track user interactions with businesses</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id="toggle-tracking"
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                          checked={trackingEnabled}
                          onChange={(e) => setTrackingEnabled(e.target.checked)}
                        />
                        <label
                          htmlFor="toggle-tracking"
                          className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Advertisements</h4>
                        <p className="text-sm text-gray-500">Enable or disable ads on the platform</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id="toggle-ads"
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                          checked={adsEnabled}
                          onChange={(e) => setAdsEnabled(e.target.checked)}
                        />
                        <label
                          htmlFor="toggle-ads"
                          className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                        ></label>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={handleUpdateSettings}
                      disabled={settingsLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {settingsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Settings'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Tab */}
          {activeTab === 'test' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Admin System Test</h2>
              </div>
              
              <AdminTest />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;