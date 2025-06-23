import { IDataProvider, Business, ContactSubmission, BusinessSubmission, SubmissionResult } from '../types';
import businessesData from '../data/businesses.json';
import servicesData from '../data/services.json';
import neighborhoodsData from '../data/neighborhoods.json';

export class JsonDataProvider implements IDataProvider {
  private businesses: Business[] = businessesData;
  private services: Record<string, string[]> = servicesData;
  private neighborhoods: Record<string, string[]> = neighborhoodsData;

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    // Convert display format back to kebab-case for filtering
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    
    return this.businesses.filter(
      business => business.category === categoryKey && business.city === cityKey
    );
  }

  async getServices(category: string): Promise<string[]> {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    return this.services[categoryKey] || [];
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    return this.neighborhoods[cityKey] || [];
  }

  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

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

      // Business name required for business listing inquiries
      if (contactData.inquiryType === 'business-listing' && !contactData.businessName?.trim()) {
        errors.push('Business name is required for business listing inquiries');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Simulate occasional failures for realistic testing
      if (Math.random() < 0.05) { // 5% failure rate
        return {
          success: false,
          message: 'Server temporarily unavailable. Please try again in a few minutes.',
          errors: ['TEMP_SERVER_ERROR']
        };
      }

      // Generate submission ID
      const submissionId = `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // In a real implementation, this would:
      // 1. Save to database
      // 2. Send email notifications
      // 3. Create support tickets
      // 4. Trigger automated workflows
      console.log('Contact submission received:', {
        ...contactData,
        submissionId
      });

      // Determine response message based on inquiry type
      let responseMessage = 'Thank you for your message! We\'ll get back to you soon.';
      
      switch (contactData.inquiryType) {
        case 'business-listing':
          responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
          break;
        case 'partnership':
          responseMessage = 'Thank you for your partnership inquiry! Our business development team will review your proposal and respond within 2-3 business days.';
          break;
        case 'technical':
          responseMessage = 'Thank you for reporting this technical issue. Our support team has been notified and will investigate immediately.';
          break;
        case 'urgent':
          responseMessage = 'Your urgent inquiry has been received and prioritized. You can expect a response within 4 hours during business hours.';
          break;
        default:
          responseMessage = `Thank you for contacting us about ${contactData.category.toLowerCase()} in ${contactData.city}! We'll respond within 24 hours.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId
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

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

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

      // Validate business hours
      const hasValidHours = Object.values(businessData.hours).some(hours => 
        hours && hours.trim() && hours.toLowerCase() !== 'closed'
      );
      if (!hasValidHours) {
        errors.push('At least one day must have business hours specified');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Check for duplicate business (simplified check)
      const existingBusiness = this.businesses.find(business => 
        business.name.toLowerCase() === businessData.businessName.toLowerCase() &&
        business.city.toLowerCase() === businessData.city.toLowerCase().replace(/\s+/g, '-')
      );

      if (existingBusiness) {
        return {
          success: false,
          message: 'A business with this name already exists in this city. Please contact us if this is your business.',
          errors: ['DUPLICATE_BUSINESS']
        };
      }

      // Simulate occasional failures for realistic testing
      if (Math.random() < 0.03) { // 3% failure rate
        return {
          success: false,
          message: 'Our system is currently experiencing high volume. Please try again in a few minutes.',
          errors: ['HIGH_VOLUME']
        };
      }

      // Generate submission ID
      const submissionId = `BUSINESS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // In a real implementation, this would:
      // 1. Save to database with pending status
      // 2. Send confirmation email to business owner
      // 3. Notify admin team for review
      // 4. Create verification workflow
      // 5. Generate business profile draft
      console.log('Business submission received:', {
        ...businessData,
        submissionId,
        status: 'pending_review'
      });

      const responseMessage = `Thank you for submitting "${businessData.businessName}" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${submissionId.slice(0, 12)}

We'll contact you at ${businessData.email} with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId
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

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  private isValidZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }
}