import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  UserCheck, 
  Flag, 
  Loader2,
  AlertCircle,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { DataProviderFactory } from '../providers';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';

const AdminDashboardPage: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'businesses' | 'messages' | 'users' | 'analytics' | 'settings'>('businesses');
  
  // State for business submissions
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [businessStatusFilter, setBusinessStatusFilter] = useState<string>('all');
  const [businessesLoading, setBusinessesLoading] = useState(true);
  
  // State for contact messages
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<string>('all');
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // State for business profiles (users)
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [usersLoading, setUsersLoading] = useState(true);
  
  // State for admin settings
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  
  // State for admin stats
  const [stats, setStats] = useState({
    pendingBusinesses: 0,
    totalBusinesses: 0,
    newMessages: 0,
    totalUsers: 0,
    premiumBusinesses: 0
  });
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Pagination for businesses
  const businessesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [businessSearchQuery, businessStatusFilter] 
  });
  
  // Pagination for messages
  const messagesPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [messageSearchQuery, messageStatusFilter] 
  });
  
  // Pagination for users
  const usersPagination = usePagination({ 
    itemsPerPage: 10, 
    resetTriggers: [userSearchQuery, userRoleFilter] 
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getProvider();

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load data on mount
  useEffect(() => {
    document.title = 'Admin Dashboard - Near Me Directory';
    loadData();
    
    // Add debug helpers to window object
    if (process.env.NODE_ENV === 'development') {
      (window as any).debugAdminDashboard = {
        checkAuth: () => console.log('Current user:', user),
        loadData,
        showStats: () => console.log('Current stats:', stats)
      };
    }
  }, []);

  // Load all data
  const loadData = async () => {
    try {
      setBusinessesLoading(true);
      setMessagesLoading(true);
      setUsersLoading(true);
      setSettingsLoading(true);
      
      // Load all data in parallel
      const [
        businessSubmissionsData, 
        contactMessagesData, 
        businessProfilesData,
        statsData
      ] = await Promise.all([
        dataProvider.getBusinessSubmissions(),
        dataProvider.getContactMessages(),
        dataProvider.getBusinessProfiles(),
        dataProvider.getAdminStats()
      ]);
      
      // Update state with loaded data
      setBusinessSubmissions(businessSubmissionsData);
      setContactMessages(contactMessagesData);
      setBusinessProfiles(businessProfilesData);
      setStats(statsData);
      
      // Load settings
      await loadSettings();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setBusinessesLoading(false);
      setMessagesLoading(false);
      setUsersLoading(false);
    }
  };

  // Load admin settings
  const loadSettings = async () => {
    try {
      // For now, just use environment variables
      // In the future, this would load from database
      setLoginEnabled(true);
      setTrackingEnabled(true);
      setAdsEnabled(false);
      setSettingsError(null);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettingsError('Failed to load settings. Please try again.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle business submission approval
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
    } catch (error) {
      console.error('Error approving business submission:', error);
    }
  };

  // Handle business submission rejection
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
    } catch (error) {
      console.error('Error rejecting business submission:', error);
    }
  };

  // Handle contact message resolution
  const handleResolveContactMessage = async (id: string) => {
    try {
      await dataProvider.resolveContactMessage(id, user?.email);
      
      // Update local state
      setContactMessages(prev => 
        prev.map(message => 
          message.id === id 
            ? { ...message, status: 'resolved', resolved_at: new Date().toISOString() } 
            : message
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        newMessages: Math.max(0, prev.newMessages - 1)
      }));
    } catch (error) {
      console.error('Error resolving contact message:', error);
    }
  };

  // Toggle login setting
  const handleToggleLogin = async () => {
    setLoginEnabled(prev => !prev);
    // In a real implementation, this would update the database
  };

  // Toggle tracking setting
  const handleToggleTracking = async () => {
    setTrackingEnabled(prev => !prev);
    // In a real implementation, this would update the database
  };

  // Toggle ads setting
  const handleToggleAds = async () => {
    setAdsEnabled(prev => !prev);
    // In a real implementation, this would update the database
  };

  // Filter business submissions
  const getFilteredBusinessSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Filter by status
      if (businessStatusFilter !== 'all' && submission.status !== businessStatusFilter) {
        return false;
      }
      
      // Filter by search query
      if (businessSearchQuery) {
        const query = businessSearchQuery.toLowerCase();
        return (
          submission.business_name.toLowerCase().includes(query) ||
          submission.owner_name.toLowerCase().includes(query) ||
          submission.email.toLowerCase().includes(query) ||
          submission.city.toLowerCase().includes(query) ||
          submission.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  // Filter contact messages
  const getFilteredContactMessages = () => {
    return contactMessages.filter(message => {
      // Filter by status
      if (messageStatusFilter !== 'all' && message.status !== messageStatusFilter) {
        return false;
      }
      
      // Filter by search query
      if (messageSearchQuery) {
        const query = messageSearchQuery.toLowerCase();
        return (
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query) ||
          (message.category && message.category.toLowerCase().includes(query)) ||
          (message.city && message.city.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  // Filter business profiles (users)
  const getFilteredBusinessProfiles = () => {
    return businessProfiles.filter(profile => {
      // Filter by role
      if (userRoleFilter !== 'all' && profile.role !== userRoleFilter) {
        return false;
      }
      
      // Filter by search query
      if (userSearchQuery) {
        const query = userSearchQuery.toLowerCase();
        return (
          profile.business_name.toLowerCase().includes(query) ||
          profile.email.toLowerCase().includes(query) ||
          (profile.role && profile.role.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render business submissions tab
  const renderBusinessSubmissionsTab = () => {
    const filteredSubmissions = getFilteredBusinessSubmissions();
    const paginatedSubmissions = businessesPagination.getPaginatedItems(filteredSubmissions);
    
    return (
      <div className="space-y-4">
        {/* Mobile Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Business Submissions</h3>
            <div className="flex sm:hidden">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={loadData}
                className="p-2 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={businessSearchQuery}
                onChange={(e) => setBusinessSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            
            <select
              value={businessStatusFilter}
              onChange={(e) => setBusinessStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="reviewed">Reviewed</option>
            </select>
            
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Mobile Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:hidden">
            <div className="bg-white rounded-t-xl w-full p-4 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={businessSearchQuery}
                      onChange={(e) => setBusinessSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={businessStatusFilter}
                    onChange={(e) => setBusinessStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setBusinessSearchQuery('');
                    setBusinessStatusFilter('all');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredSubmissions.length} of {businessSubmissions.length} businesses
          {businessSearchQuery && <span> matching "{businessSearchQuery}"</span>}
          {businessStatusFilter !== 'all' && <span> with status "{businessStatusFilter}"</span>}
        </div>
        
        {/* Business Submissions Table */}
        {businessesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No business submissions found</h3>
            <p className="text-gray-600">
              {businessSearchQuery || businessStatusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'When businesses submit applications, they will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{submission.business_name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{submission.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">{submission.category}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900">{submission.city}, {submission.state}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {submission.status === 'pending' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : submission.status === 'approved' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : submission.status === 'rejected' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Reviewed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveBusinessSubmission(submission.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRejectBusinessSubmission(submission.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              // View details (would open a modal in a real implementation)
                              console.log('View details:', submission);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={businessesPagination.currentPage}
              totalPages={businessesPagination.getTotalPages(filteredSubmissions.length)}
              itemsPerPage={businessesPagination.itemsPerPage}
              totalItems={filteredSubmissions.length}
              onPageChange={businessesPagination.setCurrentPage}
            />
          </div>
        )}
      </div>
    );
  };

  // Render contact messages tab
  const renderContactMessagesTab = () => {
    const filteredMessages = getFilteredContactMessages();
    const paginatedMessages = messagesPagination.getPaginatedItems(filteredMessages);
    
    return (
      <div className="space-y-4">
        {/* Mobile Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Contact Messages</h3>
            <div className="flex sm:hidden">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={loadData}
                className="p-2 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            
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
            
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Mobile Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:hidden">
            <div className="bg-white rounded-t-xl w-full p-4 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={messageStatusFilter}
                    onChange={(e) => setMessageStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMessageSearchQuery('');
                    setMessageStatusFilter('all');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredMessages.length} of {contactMessages.length} messages
          {messageSearchQuery && <span> matching "{messageSearchQuery}"</span>}
          {messageStatusFilter !== 'all' && <span> with status "{messageStatusFilter}"</span>}
        </div>
        
        {/* Contact Messages Table */}
        {messagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contact messages found</h3>
            <p className="text-gray-600">
              {messageSearchQuery || messageStatusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'When visitors submit contact forms, they will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{message.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900 truncate max-w-[200px]">{message.subject}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-500">{formatDate(message.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {message.status === 'new' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        ) : message.status === 'in_progress' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Resolved
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                              // View details (would open a modal in a real implementation)
                              console.log('View message details:', message);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
      </div>
    );
  };

  // Render business profiles (users) tab
  const renderUsersTab = () => {
    const filteredProfiles = getFilteredBusinessProfiles();
    const paginatedProfiles = usersPagination.getPaginatedItems(filteredProfiles);
    
    return (
      <div className="space-y-4">
        {/* Mobile Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <div className="flex sm:hidden">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={loadData}
                className="p-2 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Mobile Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:hidden">
            <div className="bg-white rounded-t-xl w-full p-4 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  >
                    <option value="all">All Roles</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setUserSearchQuery('');
                    setUserRoleFilter('all');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredProfiles.length} of {businessProfiles.length} users
          {userSearchQuery && <span> matching "{userSearchQuery}"</span>}
          {userRoleFilter !== 'all' && <span> with role "{userRoleFilter}"</span>}
        </div>
        
        {/* Business Profiles Table */}
        {usersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {userSearchQuery || userRoleFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'When users register, they will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{profile.email}</div>
                          <div className="text-sm text-gray-500">ID: {profile.id.substring(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">{profile.business_name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {profile.role === 'admin' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        ) : profile.role === 'owner' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Owner
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {profile.role || 'User'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        {profile.premium ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Basic
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              // View details (would open a modal in a real implementation)
                              console.log('View user details:', profile);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={usersPagination.currentPage}
              totalPages={usersPagination.getTotalPages(filteredProfiles.length)}
              itemsPerPage={usersPagination.itemsPerPage}
              totalItems={filteredProfiles.length}
              onPageChange={usersPagination.setCurrentPage}
            />
          </div>
        )}
      </div>
    );
  };

  // Render analytics tab
  const renderAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
        
        {/* Date Range Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Date Range</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Last 7 Days</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Last 30 Days</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Last 90 Days</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Custom Range</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">Daily</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Weekly</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Monthly</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Yearly</button>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Total Visits</h4>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">12,345</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12.3% from last period
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">New Businesses</h4>
              <div className="bg-green-100 p-2 rounded-full">
                <Building className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              8.1% from last period
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Conversion Rate</h4>
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">3.2%</div>
            <div className="text-sm text-red-600 flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              1.5% from last period
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Premium Users</h4>
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.premiumBusinesses}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              5.0% from last period
            </div>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Traffic Overview</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>
    );
  };

  // Render settings tab
  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Admin Settings</h3>
        
        {settingsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{settingsError}</div>
          </div>
        )}
        
        {settingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">User Login</h4>
                  <p className="text-sm text-gray-500 mt-1">Enable or disable user login functionality</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="toggle-login"
                    className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                    checked={loginEnabled}
                    onChange={handleToggleLogin}
                  />
                  <label
                    htmlFor="toggle-login"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      loginEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        loginEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">User Engagement Tracking</h4>
                    <p className="text-sm text-gray-500 mt-1">Enable or disable user engagement tracking</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      id="toggle-tracking"
                      className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                      checked={trackingEnabled}
                      onChange={handleToggleTracking}
                    />
                    <label
                      htmlFor="toggle-tracking"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                        trackingEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                          trackingEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">Advertisements</h4>
                    <p className="text-sm text-gray-500 mt-1">Enable or disable advertisements on the site</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      id="toggle-ads"
                      className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                      checked={adsEnabled}
                      onChange={handleToggleAds}
                    />
                    <label
                      htmlFor="toggle-ads"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                        adsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                          adsEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'businesses':
        return renderBusinessSubmissionsTab();
      case 'messages':
        return renderContactMessagesTab();
      case 'users':
        return renderUsersTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderBusinessSubmissionsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
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
          <div className="border-t border-gray-200 py-2 px-4 space-y-1 animate-fade-in">
            <button
              onClick={() => {
                setActiveTab('businesses');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'businesses' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Business Submissions
              {stats.pendingBusinesses > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                  {stats.pendingBusinesses}
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab('messages');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'messages' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5 inline-block mr-2" />
              Contact Messages
              {stats.newMessages > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                  {stats.newMessages}
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab('users');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'users' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              User Management
            </button>
            
            <button
              onClick={() => {
                setActiveTab('analytics');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'analytics' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline-block mr-2" />
              Analytics
            </button>
            
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'settings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Settings
            </button>
          </div>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'businesses' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>Business Submissions</span>
                  {stats.pendingBusinesses > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {stats.pendingBusinesses}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'messages' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>Contact Messages</span>
                  {stats.newMessages > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {stats.newMessages}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'users' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>User Management</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'analytics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span>Analytics</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </button>
              </nav>
              
              {/* Stats Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-4">Overview</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Pending Businesses</div>
                    <div className="text-sm font-medium text-gray-900">{stats.pendingBusinesses}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total Businesses</div>
                    <div className="text-sm font-medium text-gray-900">{stats.totalBusinesses}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">New Messages</div>
                    <div className="text-sm font-medium text-gray-900">{stats.newMessages}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-sm font-medium text-gray-900">{stats.totalUsers}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Premium Businesses</div>
                    <div className="text-sm font-medium text-gray-900">{stats.premiumBusinesses}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 mt-6 sm:mt-0">
            {/* Mobile Tab Navigation */}
            <div className="sm:hidden mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`flex-1 px-4 py-3 text-center text-sm font-medium whitespace-nowrap ${
                    activeTab === 'businesses' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  <span>Businesses</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 px-4 py-3 text-center text-sm font-medium whitespace-nowrap ${
                    activeTab === 'messages' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                  <span>Messages</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 px-4 py-3 text-center text-sm font-medium whitespace-nowrap ${
                    activeTab === 'users' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span>Users</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 px-4 py-3 text-center text-sm font-medium whitespace-nowrap ${
                    activeTab === 'analytics' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                  <span>Analytics</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 px-4 py-3 text-center text-sm font-medium whitespace-nowrap ${
                    activeTab === 'settings' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5 mx-auto mb-1" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;