import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  AlertCircle,
  Menu,
  X,
  RefreshCw,
  Sliders,
  Eye,
  Download,
  Trash2,
  UserCheck,
  UserX,
  Flag,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { DataProviderFactory } from '../providers';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';

const AdminDashboardPage: React.FC = () => {
  // State for admin dashboard
  const [activeTab, setActiveTab] = useState<'businesses' | 'contact' | 'users' | 'analytics' | 'settings'>('businesses');
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Pagination for businesses
  const businessesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery, statusFilter] 
  });
  
  // Pagination for contact messages
  const contactPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery, statusFilter] 
  });
  
  // Pagination for users
  const usersPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [searchQuery] 
  });
  
  // Auth and navigation
  const { user } = useAuth();
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getProvider();

  // Load data on component mount
  useEffect(() => {
    document.title = 'Admin Dashboard - Near Me Directory';
    
    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/');
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
  }, [user, navigate]);

  // Load all data from the data provider
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get data provider
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
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle business submission approval
  const handleApproveBusinessSubmission = async (id: string) => {
    try {
      await dataProvider.approveBusinessSubmission(id);
      
      // Update local data
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
        pendingBusinesses: prev.pendingBusinesses - 1,
        totalBusinesses: prev.totalBusinesses
      }));
      
    } catch (error) {
      console.error('Error approving business submission:', error);
      setError('Failed to approve business. Please try again.');
    }
  };

  // Handle business submission rejection
  const handleRejectBusinessSubmission = async (id: string) => {
    try {
      await dataProvider.rejectBusinessSubmission(id);
      
      // Update local data
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
        pendingBusinesses: prev.pendingBusinesses - 1
      }));
      
    } catch (error) {
      console.error('Error rejecting business submission:', error);
      setError('Failed to reject business. Please try again.');
    }
  };

  // Handle contact message resolution
  const handleResolveContactMessage = async (id: string) => {
    try {
      await dataProvider.resolveContactMessage(id, user?.email);
      
      // Update local data
      setContactMessages(prev => 
        prev.map(message => 
          message.id === id 
            ? { ...message, status: 'resolved', resolved_at: new Date().toISOString(), resolved_by: user?.email } 
            : message
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        newMessages: prev.newMessages - 1
      }));
      
    } catch (error) {
      console.error('Error resolving contact message:', error);
      setError('Failed to resolve message. Please try again.');
    }
  };

  // Filter business submissions based on search query and status filter
  const getFilteredBusinessSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        submission.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Filter contact messages based on search query and status filter
  const getFilteredContactMessages = () => {
    return contactMessages.filter(message => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Filter business profiles based on search query
  const getFilteredBusinessProfiles = () => {
    return businessProfiles.filter(profile => {
      // Filter by search query
      return searchQuery === '' || 
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

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
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

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'new':
        return <Flag className="w-4 h-4" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
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
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  // Get filtered data for current tab
  const filteredBusinessSubmissions = getFilteredBusinessSubmissions();
  const filteredContactMessages = getFilteredContactMessages();
  const filteredBusinessProfiles = getFilteredBusinessProfiles();
  
  // Get paginated data
  const paginatedBusinessSubmissions = businessesPagination.getPaginatedItems(filteredBusinessSubmissions);
  const paginatedContactMessages = contactPagination.getPaginatedItems(filteredContactMessages);
  const paginatedBusinessProfiles = usersPagination.getPaginatedItems(filteredBusinessProfiles);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 py-2">
            <nav className="space-y-1 px-4">
              <button
                onClick={() => { setActiveTab('businesses'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'businesses' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5 mr-3" />
                Business Submissions
                <span className="ml-auto bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                  {stats.pendingBusinesses}
                </span>
              </button>
              
              <button
                onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'contact' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Contact Messages
                <span className="ml-auto bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                  {stats.newMessages}
                </span>
              </button>
              
              <button
                onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'users' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                User Management
                <span className="ml-auto bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs">
                  {stats.totalUsers}
                </span>
              </button>
              
              <button
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
              </button>
              
              <button
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'businesses' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  Business Submissions
                  <span className="ml-auto bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                    {stats.pendingBusinesses}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'contact' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Contact Messages
                  <span className="ml-auto bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                    {stats.newMessages}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'users' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  User Management
                  <span className="ml-auto bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs">
                    {stats.totalUsers}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'analytics' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Analytics
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              {/* Desktop Header */}
              <div className="hidden lg:flex lg:items-center lg:justify-between px-4 sm:px-6 lg:px-8 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'businesses' && 'Business Submissions'}
                    {activeTab === 'contact' && 'Contact Messages'}
                    {activeTab === 'users' && 'User Management'}
                    {activeTab === 'analytics' && 'Analytics Dashboard'}
                    {activeTab === 'settings' && 'System Settings'}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {activeTab === 'businesses' && 'Manage business submissions and approvals'}
                    {activeTab === 'contact' && 'Handle customer inquiries and messages'}
                    {activeTab === 'users' && 'Manage user accounts and permissions'}
                    {activeTab === 'analytics' && 'View platform performance metrics'}
                    {activeTab === 'settings' && 'Configure system settings and features'}
                  </p>
                </div>
                <div>
                  <button
                    onClick={loadData}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Mobile Tab Header */}
              <div className="lg:hidden px-4 sm:px-6 mb-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900">
                    {activeTab === 'businesses' && 'Business Submissions'}
                    {activeTab === 'contact' && 'Contact Messages'}
                    {activeTab === 'users' && 'User Management'}
                    {activeTab === 'analytics' && 'Analytics Dashboard'}
                    {activeTab === 'settings' && 'System Settings'}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMobileFilters}
                      className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                      <Sliders className="w-5 h-5" />
                    </button>
                    <button
                      onClick={loadData}
                      className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-4 sm:px-6 lg:px-8">
                {/* Business Submissions Tab */}
                {activeTab === 'businesses' && (
                  <div>
                    {/* Search and Filters */}
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search businesses..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          <button
                            onClick={loadData}
                            className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                        {filteredBusinessSubmissions.length} of {businessSubmissions.length} businesses
                        {businessesPagination.currentPage > 1 && (
                          <span className="ml-2">
                            • Page {businessesPagination.currentPage} of {businessesPagination.getTotalPages(filteredBusinessSubmissions.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Business Submissions Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
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
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Submitted
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedBusinessSubmissions.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                  No business submissions found
                                </td>
                              </tr>
                            ) : (
                              paginatedBusinessSubmissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {submission.business_name}
                                        </div>
                                        <div className="text-sm text-gray-500 hidden sm:block">
                                          {submission.owner_name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-gray-900">{submission.email}</div>
                                    <div className="text-sm text-gray-500">{submission.phone}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                    <div className="text-sm text-gray-900">{submission.city}, {submission.state}</div>
                                    <div className="text-sm text-gray-500">{submission.category}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(submission.status)}`}>
                                      <span className="flex items-center">
                                        {getStatusIcon(submission.status)}
                                        <span className="ml-1 capitalize">{submission.status}</span>
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {formatDate(submission.submitted_at)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                      {submission.status === 'pending' && (
                                        <>
                                          <button
                                            onClick={() => handleApproveBusinessSubmission(submission.id)}
                                            className="text-green-600 hover:text-green-900 p-1"
                                            title="Approve"
                                          >
                                            <UserCheck className="w-5 h-5" />
                                          </button>
                                          <button
                                            onClick={() => handleRejectBusinessSubmission(submission.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                            title="Reject"
                                          >
                                            <UserX className="w-5 h-5" />
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => {
                                          // View details functionality
                                          console.log('View details for:', submission);
                                        }}
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
                    </div>
                    
                    {/* Pagination */}
                    {filteredBusinessSubmissions.length > 0 && (
                      <Pagination
                        currentPage={businessesPagination.currentPage}
                        totalPages={businessesPagination.getTotalPages(filteredBusinessSubmissions.length)}
                        itemsPerPage={businessesPagination.itemsPerPage}
                        totalItems={filteredBusinessSubmissions.length}
                        onPageChange={businessesPagination.setCurrentPage}
                      />
                    )}
                  </div>
                )}

                {/* Contact Messages Tab */}
                {activeTab === 'contact' && (
                  <div>
                    {/* Search and Filters */}
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="all">All Statuses</option>
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          
                          <button
                            onClick={loadData}
                            className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                        {filteredContactMessages.length} of {contactMessages.length} messages
                        {contactPagination.currentPage > 1 && (
                          <span className="ml-2">
                            • Page {contactPagination.currentPage} of {contactPagination.getTotalPages(filteredContactMessages.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Messages Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
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
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Category
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Received
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedContactMessages.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                  No contact messages found
                                </td>
                              </tr>
                            ) : (
                              paginatedContactMessages.map((message) => (
                                <tr key={message.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {message.name}
                                        </div>
                                        <div className="text-sm text-gray-500 hidden sm:block">
                                          {message.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 line-clamp-2">{message.subject}</div>
                                    <div className="text-xs text-gray-500 line-clamp-1 hidden sm:block">{message.message.substring(0, 50)}...</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-gray-900">{message.category || 'General'}</div>
                                    <div className="text-sm text-gray-500">{message.city || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(message.status)}`}>
                                      <span className="flex items-center">
                                        {getStatusIcon(message.status)}
                                        <span className="ml-1 capitalize">{message.status}</span>
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {formatDate(message.created_at)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                      {message.status !== 'resolved' && (
                                        <button
                                          onClick={() => handleResolveContactMessage(message.id)}
                                          className="text-green-600 hover:text-green-900 p-1"
                                          title="Mark as Resolved"
                                        >
                                          <CheckCircle className="w-5 h-5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          // View details functionality
                                          console.log('View details for:', message);
                                        }}
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
                    </div>
                    
                    {/* Pagination */}
                    {filteredContactMessages.length > 0 && (
                      <Pagination
                        currentPage={contactPagination.currentPage}
                        totalPages={contactPagination.getTotalPages(filteredContactMessages.length)}
                        itemsPerPage={contactPagination.itemsPerPage}
                        totalItems={filteredContactMessages.length}
                        onPageChange={contactPagination.setCurrentPage}
                      />
                    )}
                  </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                  <div>
                    {/* Search */}
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={loadData}
                            className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                        {filteredBusinessProfiles.length} of {businessProfiles.length} users
                        {usersPagination.currentPage > 1 && (
                          <span className="ml-2">
                            • Page {usersPagination.currentPage} of {usersPagination.getTotalPages(filteredBusinessProfiles.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* User Management Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
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
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedBusinessProfiles.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                  No users found
                                </td>
                              </tr>
                            ) : (
                              paginatedBusinessProfiles.map((profile) => (
                                <tr key={profile.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {profile.email}
                                        </div>
                                        <div className="text-sm text-gray-500 hidden sm:block">
                                          ID: {profile.id.substring(0, 8)}...
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-gray-900">{profile.business_name || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{profile.business_id || 'No business ID'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      profile.role === 'admin' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {profile.role || 'user'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      profile.premium 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {profile.premium ? 'Premium' : 'Basic'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button
                                        onClick={() => {
                                          // View details functionality
                                          console.log('View details for:', profile);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 p-1"
                                        title="View Details"
                                      >
                                        <Eye className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          // Edit functionality
                                          console.log('Edit user:', profile);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                        title="Edit User"
                                      >
                                        <Settings className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Pagination */}
                    {filteredBusinessProfiles.length > 0 && (
                      <Pagination
                        currentPage={usersPagination.currentPage}
                        totalPages={usersPagination.getTotalPages(filteredBusinessProfiles.length)}
                        itemsPerPage={usersPagination.itemsPerPage}
                        totalItems={filteredBusinessProfiles.length}
                        onPageChange={usersPagination.setCurrentPage}
                      />
                    )}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div>
                    {/* Date Range Controls */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                              <div className="text-sm text-blue-600">Pending Businesses</div>
                              <div className="text-2xl font-bold text-blue-900">{stats.pendingBusinesses}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <Users className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                              <div className="text-sm text-green-600">Total Businesses</div>
                              <div className="text-2xl font-bold text-green-900">{stats.totalBusinesses}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <MessageSquare className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                              <div className="text-sm text-yellow-600">New Messages</div>
                              <div className="text-2xl font-bold text-yellow-900">{stats.newMessages}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                              <div className="text-sm text-purple-600">Premium Businesses</div>
                              <div className="text-2xl font-bold text-purple-900">{stats.premiumBusinesses}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chart Placeholder */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Business Growth</h2>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Chart will be displayed here</p>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">New business submission</div>
                            <div className="text-sm text-gray-500">A new business was submitted for approval</div>
                            <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Business approved</div>
                            <div className="text-sm text-gray-500">A business submission was approved</div>
                            <div className="text-xs text-gray-400 mt-1">5 hours ago</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-yellow-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">New contact message</div>
                            <div className="text-sm text-gray-500">A new contact message was received</div>
                            <div className="text-xs text-gray-400 mt-1">1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <div className="bg-white shadow sm:rounded-md mb-6">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          System Settings
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Configure global settings for the platform.</p>
                        </div>
                        <div className="mt-5 space-y-6">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="login-enabled"
                                name="login-enabled"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={true}
                                onChange={() => {
                                  // Toggle login enabled
                                  console.log('Toggle login enabled');
                                }}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="login-enabled" className="font-medium text-gray-700">
                                Enable User Login
                              </label>
                              <p className="text-gray-500">
                                Allow users to log in to the platform. Disabling this will prevent all users from logging in.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="tracking-enabled"
                                name="tracking-enabled"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={true}
                                onChange={() => {
                                  // Toggle tracking enabled
                                  console.log('Toggle tracking enabled');
                                }}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="tracking-enabled" className="font-medium text-gray-700">
                                Enable User Tracking
                              </label>
                              <p className="text-gray-500">
                                Track user engagement with businesses. This helps provide analytics to business owners.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="ads-enabled"
                                name="ads-enabled"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={false}
                                onChange={() => {
                                  // Toggle ads enabled
                                  console.log('Toggle ads enabled');
                                }}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="ads-enabled" className="font-medium text-gray-700">
                                Enable Advertisements
                              </label>
                              <p className="text-gray-500">
                                Show advertisements on the platform. This can generate additional revenue.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {
                            // Save settings
                            console.log('Save settings');
                          }}
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow sm:rounded-md">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Admin Account
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Manage your admin account settings.</p>
                        </div>
                        <div className="mt-5">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Account Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={toggleMobileFilters}></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Filters
                      </h3>
                      <button
                        onClick={toggleMobileFilters}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="mobile-search" className="block text-sm font-medium text-gray-700 mb-1">
                          Search
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="mobile-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${activeTab}...`}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      {(activeTab === 'businesses' || activeTab === 'contact') && (
                        <div>
                          <label htmlFor="mobile-status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            id="mobile-status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="all">All Statuses</option>
                            {activeTab === 'businesses' && (
                              <>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </>
                            )}
                            {activeTab === 'contact' && (
                              <>
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                              </>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleMobileFilters}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    toggleMobileFilters();
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;