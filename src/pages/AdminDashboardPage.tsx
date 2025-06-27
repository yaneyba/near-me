import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building, 
  BarChart3, 
  Settings, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Star,
  Flag,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Save,
  Lock,
  Activity
} from 'lucide-react';
import { DataProviderFactory } from '../providers';
import { useAuth, isUserAdmin, getAuthFeatureFlags, setAuthFeatureFlags, updateDatabaseSettings } from '../lib/auth';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'contacts' | 'users' | 'analytics' | 'settings'>('businesses');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [businessSubmissions, setBusinessSubmissions] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingBusinesses: 0,
    totalBusinesses: 0,
    newMessages: 0,
    totalUsers: 0,
    premiumBusinesses: 0
  });
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Settings state
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  const { user, authFeatures } = useAuth();
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getProvider();

  useEffect(() => {
    document.title = 'Admin Dashboard - Near Me Directory';
    
    const checkAdmin = async () => {
      try {
        const admin = await isUserAdmin();
        setIsAdmin(admin);
        
        if (!admin) {
          navigate('/', { replace: true });
        } else {
          loadData();
          loadSettings();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // Load settings from auth features
  const loadSettings = () => {
    const features = getAuthFeatureFlags();
    setLoginEnabled(features.loginEnabled);
    setTrackingEnabled(features.trackingEnabled ?? true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Import supabase directly for admin operations
      const { supabase } = await import('../lib/supabase');
      
      // Load real business submissions from database
      const { data: businessSubmissionsData, error: submissionsError } = await supabase
        .from('business_submissions')
        .select(`
          id,
          business_name,
          owner_name,
          email,
          phone,
          address,
          city,
          state,
          zip_code,
          category,
          website,
          description,
          services,
          hours,
          status,
          submitted_at,
          reviewed_at,
          reviewer_notes,
          site_id
        `)
        .order('submitted_at', { ascending: false });
      
      if (submissionsError) {
        console.error('Error loading business submissions:', submissionsError);
        throw submissionsError;
      }
      
      // Load real business profiles for users data  
      const { data: businessProfilesData, error: profilesError } = await supabase
        .from('business_profiles')
        .select(`
          id,
          user_id,
          business_name,
          email,
          role,
          approval_status,
          premium,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error loading business profiles:', profilesError);
        throw profilesError;
      }
      
      // Load real contact messages from database
      const { data: contactMessagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select(`
          id,
          name,
          email,
          subject,
          message,
          category,
          city,
          status,
          admin_notes,
          resolved_at,
          resolved_by,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Error loading contact messages:', messagesError);
        // Continue without contact messages if they fail to load
      }
      
      // Calculate stats
      const stats = {
        pendingBusinesses: businessSubmissionsData?.filter((b: any) => b.status === 'pending').length || 0,
        totalBusinesses: businessSubmissionsData?.length || 0,
        newMessages: contactMessagesData?.filter((m: any) => m.status === 'new').length || 0,
        totalUsers: businessProfilesData?.length || 0,
        premiumBusinesses: businessProfilesData?.filter((p: any) => p.premium === true).length || 0
      };
      
      setBusinessSubmissions(businessSubmissionsData || []);
      setContactMessages(contactMessagesData || []);
      setUsers(businessProfilesData || []);
      setStats(stats);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setSettingsError(null);
      setSettingsSuccess(null);
      
      // Update settings in database
      const success = await updateDatabaseSettings({
        loginEnabled,
        trackingEnabled
      });
      
      if (success) {
        setSettingsSuccess('Settings saved successfully');
      } else {
        setSettingsError('Failed to save settings to database');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSettingsError('An unexpected error occurred');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleApproveBusinessSubmission = async (id: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Get the submission data first to pass to the creation function
      const { data: submission, error: fetchError } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError || !submission) {
        console.error('Error fetching submission:', fetchError);
        alert('Failed to find submission. Please try again.');
        return;
      }
      
      // Update the submission status in the database
      const { error: updateError } = await supabase
        .from('business_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: 'Approved by admin'
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Error approving business submission:', updateError);
        alert('Failed to approve submission. Please try again.');
        return;
      }
      
      // Create business entry from submission
      await createBusinessProfileFromSubmission(submission);
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { 
                ...submission, 
                status: 'approved', 
                reviewed_at: new Date().toISOString(),
                reviewer_notes: 'Approved by admin'
              } 
            : submission
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: prev.pendingBusinesses - 1
      }));
      
      console.log('Business submission approved and business created successfully');
      alert('Business submission approved successfully! Business has been added to the directory.');
    } catch (error) {
      console.error('Error approving business submission:', error);
      alert('Failed to approve submission. Please try again.');
    }
  };

  // Helper function to create business profile after approval
  const createBusinessProfileFromSubmission = async (submission: any) => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('email', submission.email)
        .single();
      
      if (existingProfile) {
        console.log('Business profile already exists for this email');
        return;
      }
      
      // For now, we'll create a business profile without a user_id
      // In a full implementation, you'd want to invite the user to create an account
      // or create the user account automatically
      
      // Create business entry in the businesses table first
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert({
          business_id: `${submission.city.toLowerCase().replace(/\s+/g, '-')}-${submission.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: submission.business_name,
          description: submission.description,
          address: submission.address,
          phone: submission.phone,
          website: submission.website,
          email: submission.email,
          category: submission.category,
          city: submission.city,
          state: submission.state,
          services: submission.services || [],
          hours: submission.hours,
          site_id: submission.site_id || 'near-me-us',
          status: 'active',
          verified: true // Auto-verify approved submissions
        })
        .select('business_id')
        .single();
      
      if (businessError) {
        console.error('Error creating business entry:', businessError);
        return;
      }
      
      console.log('Business entry created successfully:', businessData.business_id);
    } catch (error) {
      console.error('Error creating business profile:', error);
    }
  };

  const handleRejectBusinessSubmission = async (id: string, notes?: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Update the submission status in the database
      const { error: updateError } = await supabase
        .from('business_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes || 'Rejected by admin'
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Error rejecting business submission:', updateError);
        alert('Failed to reject submission. Please try again.');
        return;
      }
      
      // Update local state
      setBusinessSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { 
                ...submission, 
                status: 'rejected', 
                reviewed_at: new Date().toISOString(),
                reviewer_notes: notes || 'Rejected by admin'
              } 
            : submission
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingBusinesses: prev.pendingBusinesses - 1
      }));
      
      console.log('Business submission rejected successfully');
    } catch (error) {
      console.error('Error rejecting business submission:', error);
      alert('Failed to reject submission. Please try again.');
    }
  };

  const handleResolveContactMessage = (id: string) => {
    // In a real implementation, this would call an API
    setContactMessages(prev => 
      prev.map(message => 
        message.id === id 
          ? { ...message, status: 'resolved' } 
          : message
      )
    );
    
    // Update stats
    setStats(prev => ({
      ...prev,
      newMessages: prev.newMessages - 1
    }));
  };

  const getFilteredBusinessSubmissions = () => {
    return businessSubmissions.filter(submission => {
      // Apply status filter
      if (statusFilter !== 'all' && submission.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
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

  const getFilteredContactMessages = () => {
    return contactMessages.filter(message => {
      // Apply status filter
      if (statusFilter !== 'all' && message.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query) ||
          (message.city && message.city.toLowerCase().includes(query)) ||
          (message.category && message.category.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      // Apply role filter
      if (statusFilter !== 'all' && user.role !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.email.toLowerCase().includes(query) ||
          user.business_name.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Mail className="w-3 h-3 mr-1" />
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <RefreshCw className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      case 'owner':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Building className="w-3 h-3 mr-1" />
            Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Near Me Directory Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">{user?.email}</div>
                <div className="text-xs text-gray-300 flex items-center">
                  <Shield className="w-3 h-3 text-red-400 mr-1" />
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending Businesses</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingBusinesses}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Businesses</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</h3>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">New Messages</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.newMessages}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Premium Businesses</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.premiumBusinesses}</h3>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Business Submissions
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'contacts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Messages
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analytics
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        {activeTab !== 'settings' && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                {activeTab === 'businesses' && (
                  <>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
                {activeTab === 'contacts' && (
                  <>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </>
                )}
                {activeTab === 'users' && (
                  <>
                    <option value="admin">Admins</option>
                    <option value="owner">Business Owners</option>
                  </>
                )}
              </select>
            </div>
            
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        )}

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Business Submissions Tab */}
          {activeTab === 'businesses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Business Submissions</h2>
                <button
                  onClick={() => {
                    // In a real implementation, this would export data
                    alert('Export functionality would be implemented here');
                  }}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
              
              {getFilteredBusinessSubmissions().length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No business submissions found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search or filters' 
                      : 'New submissions will appear here'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category/Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredBusinessSubmissions().map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{submission.business_name}</div>
                                <div className="text-sm text-gray-500">{submission.owner_name}</div>
                                <div className="text-sm text-gray-500">{submission.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                            <div className="text-sm text-gray-500">{submission.city}, {submission.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(submission.submitted_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  // In a real implementation, this would open a detail view
                                  alert(`View details for ${submission.business_name}`);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {submission.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveBusinessSubmission(submission.id)}
                                    className="text-green-600 hover:text-green-900 p-1"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleRejectBusinessSubmission(submission.id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Reject"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              
                              <button
                                onClick={() => {
                                  // In a real implementation, this would open an edit form
                                  alert(`Edit ${submission.business_name}`);
                                }}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Contact Messages</h2>
                <button
                  onClick={() => {
                    // In a real implementation, this would export data
                    alert('Export functionality would be implemented here');
                  }}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
              
              {getFilteredContactMessages().length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search or filters' 
                      : 'New messages will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredContactMessages().map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900 mr-3">{message.subject}</h3>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <div className="mr-4">{message.name}</div>
                            <div>{message.email}</div>
                          </div>
                          {(message.category || message.city) && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              {message.category && (
                                <div className="mr-4">
                                  Category: {message.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </div>
                              )}
                              {message.city && (
                                <div>Location: {message.city}</div>
                              )}
                            </div>
                          )}
                          <div className="text-sm text-gray-500 mb-4">
                            Received: {formatDate(message.created_at)}
                          </div>
                          <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {message.message}
                          </div>
                        </div>
                        <div className="flex space-x-2">
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
                              // In a real implementation, this would open a reply form
                              alert(`Reply to ${message.name}`);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Reply"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => {
                    // In a real implementation, this would open a form to create a new user
                    alert('Create user functionality would be implemented here');
                  }}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>
              
              {getFilteredUsers().length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search or filters' 
                      : 'Users will appear here'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredUsers().map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.business_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  // In a real implementation, this would open a detail view
                                  alert(`View details for ${user.email}`);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  // In a real implementation, this would open an edit form
                                  alert(`Edit ${user.email}`);
                                }}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => {
                                    // In a real implementation, this would delete the user
                                    alert(`Delete ${user.email}`);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Platform Analytics</h2>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value as any);
                      setCustomDateRange(false);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={customDateRange}
                  >
                    <option value="day">Last 24 Hours</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last 12 Months</option>
                  </select>
                  
                  <button
                    onClick={() => setCustomDateRange(!customDateRange)}
                    className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                      customDateRange 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Custom Range
                    {customDateRange ? (
                      <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Custom date range inputs */}
              {customDateRange && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">End Date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      // In a real implementation, this would load data for the date range
                      alert(`Load data from ${startDate} to ${endDate}`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              
              {/* Analytics Content - This would be replaced with real charts in a production implementation */}
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  In a production environment, this section would display charts and metrics for platform usage, 
                  user growth, business submissions, and other key performance indicators.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
              </div>

              {settingsError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">{settingsError}</div>
                </div>
              )}
              
              {settingsSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-700">{settingsSuccess}</div>
                </div>
              )}

              <div className="space-y-8">
                {/* Authentication Settings */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-gray-500" />
                      Authentication Settings
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Lock className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-base font-medium text-gray-900">User Login</h3>
                            <p className="text-sm text-gray-500">
                              Allow users to log in to their accounts. When disabled, users will be redirected to the home page if they try to access the login page.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLoginEnabled(!loginEnabled)}
                        className={`${
                          loginEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        <span className="sr-only">Toggle login</span>
                        <span
                          className={`${
                            loginEnabled ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                        >
                          {loginEnabled ? (
                            <ToggleRight className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tracking Settings */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-gray-500" />
                      Tracking Settings
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Activity className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-base font-medium text-gray-900">User Engagement Tracking</h3>
                            <p className="text-sm text-gray-500">
                              Track user interactions with business listings, including views, phone calls, website clicks, and other engagement metrics. When disabled, no user activity will be recorded.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTrackingEnabled(!trackingEnabled)}
                        className={`${
                          trackingEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        <span className="sr-only">Toggle tracking</span>
                        <span
                          className={`${
                            trackingEnabled ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                        >
                          {trackingEnabled ? (
                            <ToggleRight className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {savingSettings ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>

                {/* Important Notes */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                      <div className="mt-2 text-sm text-yellow-700 space-y-2">
                        <p>
                          <strong>Login Setting:</strong> Disabling login will prevent all users from accessing their accounts, including business owners.
                          This should only be used for maintenance or security purposes.
                        </p>
                        <p>
                          <strong>Tracking Setting:</strong> Disabling tracking will stop all user engagement data collection across all sites.
                          This will affect analytics and reporting for all businesses.
                        </p>
                      </div>
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