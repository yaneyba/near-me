import { createClient } from '@supabase/supabase-js';

// Admin service using service role for privileged operations
class AdminService {
  private adminClient: any;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase admin credentials');
      throw new Error('Admin service configuration missing');
    }

    // Create admin client with service role
    this.adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // Get all business submissions (admin only)
  async getBusinessSubmissions() {
    const { data, error } = await this.adminClient
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

    if (error) throw error;
    return data || [];
  }

  // Get all business profiles (admin only)
  async getBusinessProfiles() {
    const { data, error } = await this.adminClient
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

    if (error) throw error;
    return data || [];
  }

  // Get all contact messages (admin only)
  async getContactMessages() {
    const { data, error } = await this.adminClient
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

    if (error) throw error;
    return data || [];
  }

  // Approve business submission (admin only)
  async approveBusinessSubmission(id: string, reviewerNotes?: string) {
    // Get the submission first
    const { data: submission, error: fetchError } = await this.adminClient
      .from('business_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      throw new Error('Submission not found');
    }

    // Update submission status
    const { error: updateError } = await this.adminClient
      .from('business_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewerNotes || 'Approved by admin'
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Create business entry
    await this.createBusinessFromSubmission(submission);
  }

  // Reject business submission (admin only)
  async rejectBusinessSubmission(id: string, reviewerNotes?: string) {
    const { error } = await this.adminClient
      .from('business_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewerNotes || 'Rejected by admin'
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Resolve contact message (admin only)
  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string) {
    const { error } = await this.adminClient
      .from('contact_messages')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy || 'admin',
        admin_notes: adminNotes
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Helper to create business from approved submission
  private async createBusinessFromSubmission(submission: any) {
    // Check if business already exists
    const { data: existingBusiness } = await this.adminClient
      .from('businesses')
      .select('id')
      .eq('email', submission.email)
      .eq('name', submission.business_name)
      .single();

    if (existingBusiness) {
      console.log('Business already exists in directory');
      return;
    }

    // Create business entry
    const { error: businessError } = await this.adminClient
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
        verified: true
      });

    if (businessError) throw businessError;
  }

  // Get admin statistics
  async getAdminStats() {
    const [submissions, profiles, messages] = await Promise.all([
      this.getBusinessSubmissions(),
      this.getBusinessProfiles(),
      this.getContactMessages()
    ]);

    return {
      pendingBusinesses: submissions.filter((s: any) => s.status === 'pending').length,
      totalBusinesses: submissions.length,
      newMessages: messages.filter((m: any) => m.status === 'new').length,
      totalUsers: profiles.length,
      premiumBusinesses: profiles.filter((p: any) => p.premium === true).length
    };
  }
}

// Singleton instance
export const adminService = new AdminService();
