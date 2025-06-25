import { supabase, type Database } from '../lib/supabase';
import { ContactSubmission, BusinessSubmission, SubmissionResult } from '../types';

export class SupabaseDataProvider {
  /**
   * Submit contact form to Supabase using existing schema
   */
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      // Validate required fields
      const errors: string[] = [];
      
      if (!contactData.name?.trim()) {
        errors.push('Name is required');
      }
      
      if (!contactData.email?.trim()) {
        errors.push('Email is required');
      } else if (!this.isValidEmail(contactData.email)) {
        errors.push('Invalid email format');
      }
      
      if (!contactData.subject?.trim()) {
        errors.push('Subject is required');
      }
      
      if (!contactData.message?.trim()) {
        errors.push('Message is required');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Insert into existing contact_messages table
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          category: contactData.category || null,
          city: contactData.city || null,
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific Supabase errors
        if (error.code === 'PGRST116') {
          return {
            success: false,
            message: 'Database connection error. Please try again later.',
            errors: ['DATABASE_CONNECTION_ERROR']
          };
        }
        
        return {
          success: false,
          message: 'Failed to submit your message. Please try again.',
          errors: ['SUBMISSION_ERROR']
        };
      }

      // Generate response message based on inquiry type
      let responseMessage = 'Thank you for your message! We\'ll get back to you soon.';
      
      if (contactData.inquiryType === 'business-listing') {
        responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
      } else if (contactData.inquiryType === 'partnership') {
        responseMessage = 'Thank you for your partnership inquiry! Our business development team will review your proposal and respond within 2-3 business days.';
      } else if (contactData.inquiryType === 'technical') {
        responseMessage = 'Thank you for reporting this technical issue. Our support team has been notified and will investigate immediately.';
      } else {
        responseMessage = `Thank you for contacting us about ${contactData.category?.toLowerCase()} in ${contactData.city}! We'll respond within 24 hours.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id
      };

    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        errors: ['UNEXPECTED_ERROR']
      };
    }
  }

  /**
   * Submit business application to Supabase using existing schema
   */
  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      // Validate required fields
      const errors: string[] = [];
      
      if (!businessData.businessName?.trim()) {
        errors.push('Business name is required');
      }
      
      if (!businessData.ownerName?.trim()) {
        errors.push('Owner/Manager name is required');
      }
      
      if (!businessData.email?.trim()) {
        errors.push('Email is required');
      } else if (!this.isValidEmail(businessData.email)) {
        errors.push('Invalid email format');
      }
      
      if (!businessData.phone?.trim()) {
        errors.push('Phone number is required');
      }
      
      if (!businessData.address?.trim()) {
        errors.push('Address is required');
      }
      
      if (!businessData.city?.trim()) {
        errors.push('City is required');
      }
      
      if (!businessData.state?.trim()) {
        errors.push('State is required');
      }
      
      if (!businessData.zipCode?.trim()) {
        errors.push('ZIP code is required');
      }

      // Validate services
      const totalServices = businessData.services.length + businessData.customServices.length;
      if (totalServices === 0) {
        errors.push('At least one service must be selected or added');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Check for duplicate business - Fixed: Remove .single() to avoid PGRST116 error
      const { data: existingBusinesses, error: duplicateCheckError } = await supabase
        .from('business_submissions')
        .select('id')
        .eq('business_name', businessData.businessName)
        .eq('city', businessData.city)
        .eq('state', businessData.state);

      // Handle duplicate check error
      if (duplicateCheckError) {
        console.error('Error checking for duplicate business:', duplicateCheckError);
        // Continue with submission even if duplicate check fails
      }

      // Check if any existing businesses were found
      if (existingBusinesses && existingBusinesses.length > 0) {
        return {
          success: false,
          message: 'A business with this name already exists in this city. Please contact us if this is your business.',
          errors: ['DUPLICATE_BUSINESS']
        };
      }

      // Combine all services
      const allServices = [...businessData.services, ...businessData.customServices];

      // Insert into existing business_submissions table with correct enum type
      const { data, error } = await supabase
        .from('business_submissions')
        .insert({
          business_name: businessData.businessName,
          owner_name: businessData.ownerName,
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          city: businessData.city,
          state: businessData.state,
          zip_code: businessData.zipCode,
          category: businessData.category,
          website: businessData.website || null,
          description: businessData.description || null,
          services: allServices,
          hours: businessData.hours,
          status: 'pending' as Database['public']['Enums']['submission_status'],
          site_id: 'near-me-us'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle RLS policy violation specifically
        if (error.code === '42501' || error.message?.includes('row-level security policy')) {
          return {
            success: false,
            message: 'We\'re currently experiencing technical difficulties with business submissions. Please try again later or contact us directly.',
            errors: ['RLS_POLICY_ERROR']
          };
        }
        
        // Handle specific Supabase errors
        if (error.code === 'PGRST116') {
          return {
            success: false,
            message: 'Database connection error. Please try again later.',
            errors: ['DATABASE_CONNECTION_ERROR']
          };
        }
        
        if (error.code === '23505') { // Unique constraint violation
          return {
            success: false,
            message: 'A business with this information already exists. Please contact us if this is your business.',
            errors: ['DUPLICATE_BUSINESS']
          };
        }
        
        return {
          success: false,
          message: 'Failed to submit your business application. Please try again.',
          errors: ['SUBMISSION_ERROR']
        };
      }

      const responseMessage = `Thank you for submitting "${businessData.businessName}" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${data.id.slice(0, 12)}

We'll contact you at ${businessData.email} with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id
      };

    } catch (error) {
      console.error('Error submitting business application:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while submitting your application. Please try again later.',
        errors: ['UNEXPECTED_ERROR']
      };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}