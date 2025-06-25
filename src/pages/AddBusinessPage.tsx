import React, { useState, useEffect } from 'react';
import { SubdomainInfo } from '../types';
import { generateTitle } from '../utils/subdomainParser';
import { DataProviderFactory } from '../providers';
import { BusinessSubmission } from '../types';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Star,
  Globe,
  Camera,
  DollarSign,
  Users,
  Award,
  Zap,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Plus
} from 'lucide-react';

interface AddBusinessPageProps {
  subdomainInfo: SubdomainInfo;
}

interface BusinessFormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website: string;
  description: string;
  services: string[];
  hours: {
    [key: string]: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessType: 'individual' | 'franchise' | 'chain';
  yearsInBusiness: string;
  employeeCount: string;
  specialOffers: string;
  customServices: string[];
}

interface FormErrors {
  [key: string]: string;
}

interface SubmissionResult {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: string[];
}

// Success component
const SubmissionSuccess: React.FC<{ 
  result: SubmissionResult; 
  onReset: () => void;
  category: string;
  city: string;
}> = ({ result, onReset, category, city }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 whitespace-pre-line">
            {result.message}
          </p>
          
          {result.submissionId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Submission Details</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Reference ID:</strong> {result.submissionId.slice(0, 12)}
              </p>
              <p className="text-sm text-gray-500">
                Save this reference ID for tracking your application status.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Review Process</h4>
              <p className="text-sm text-gray-600">2-3 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Email Updates</h4>
              <p className="text-sm text-gray-600">Status notifications</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Go Live</h4>
              <p className="text-sm text-gray-600">Start getting customers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Submit Another Business
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Return to Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ subdomainInfo }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmissionResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const totalSteps = 4;

  const dataProvider = DataProviderFactory.getProvider();

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: subdomainInfo.city,
    state: subdomainInfo.state,
    zipCode: '',
    category: subdomainInfo.category.toLowerCase().replace(/\s+/g, '-'),
    website: '',
    description: '',
    services: [],
    hours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 4:00 PM',
      Sunday: 'Closed'
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    businessType: 'individual',
    yearsInBusiness: '',
    employeeCount: '',
    specialOffers: '',
    customServices: []
  });

  // Update document title
  useEffect(() => {
    document.title = `Add Your Business - ${generateTitle(subdomainInfo.category, subdomainInfo.city, subdomainInfo.state)}`;
  }, [subdomainInfo]);

  // Get available services based on category
  const getAvailableServices = (): string[] => {
    const serviceMap: Record<string, string[]> = {
      'nail-salons': ['Manicures', 'Pedicures', 'Nail Art', 'Gel Polish', 'Acrylic Nails', 'Dip Powder', 'Nail Extensions', 'Cuticle Care', 'Hand Treatments', 'Spa Pedicures'],
      'auto-repair': ['Oil Changes', 'Brake Repair', 'Engine Diagnostics', 'Transmission Service', 'Tire Service', 'AC Repair', 'Electrical Work', 'Battery Replacement', 'Tune-ups', 'Exhaust Repair'],
      'restaurants': ['Fine Dining', 'Casual Dining', 'Takeout', 'Delivery', 'Catering', 'Private Events', 'Brunch', 'Happy Hour', 'Outdoor Seating', 'Live Music'],
      'hair-salons': ['Haircuts', 'Hair Coloring', 'Highlights', 'Perms', 'Hair Styling', 'Blowouts', 'Hair Treatments', 'Extensions', 'Beard Trimming', 'Wedding Hair']
    };
    
    return serviceMap[formData.category] || [];
  };

  const getCategorySpecificContent = () => {
    const contentMap: Record<string, {
      title: string;
      subtitle: string;
      benefits: string[];
      placeholders: {
        businessName: string;
        description: string;
        specialOffers: string;
      };
    }> = {
      'nail-salons': {
        title: 'Add Your Nail Salon',
        subtitle: 'Connect with customers looking for professional nail care services',
        benefits: [
          'Attract clients seeking manicures, pedicures, and nail art',
          'Showcase your nail technicians\' expertise and creativity',
          'Highlight your salon\'s hygiene standards and atmosphere'
        ],
        placeholders: {
          businessName: 'e.g., Luxe Nail Studio, Perfect Polish Salon',
          description: 'Describe your nail salon, specialties, atmosphere, and what makes your nail services unique...',
          specialOffers: 'e.g., 20% off first visit, Free nail art with gel manicure'
        }
      },
      'auto-repair': {
        title: 'Add Your Auto Repair Shop',
        subtitle: 'Connect with vehicle owners needing reliable automotive services',
        benefits: [
          'Reach customers needing car maintenance and repairs',
          'Showcase your certified mechanics and equipment',
          'Build trust through verified customer reviews'
        ],
        placeholders: {
          businessName: 'e.g., Quick Fix Auto, Precision Auto Repair',
          description: 'Describe your auto repair services, certifications, equipment, and commitment to quality...',
          specialOffers: 'e.g., Free diagnostic with repair, 10% off first service'
        }
      },
      'restaurants': {
        title: 'Add Your Restaurant',
        subtitle: 'Connect with diners looking for great food experiences',
        benefits: [
          'Attract hungry customers in your area',
          'Showcase your cuisine, atmosphere, and specialties',
          'Increase reservations and takeout orders'
        ],
        placeholders: {
          businessName: 'e.g., Bella Vista Italian, The Local Bistro',
          description: 'Describe your restaurant, cuisine type, atmosphere, signature dishes, and dining experience...',
          specialOffers: 'e.g., Happy hour 4-6 PM, 15% off lunch specials'
        }
      },
      'hair-salons': {
        title: 'Add Your Hair Salon',
        subtitle: 'Connect with clients seeking professional hair care services',
        benefits: [
          'Attract clients looking for cuts, color, and styling',
          'Showcase your stylists\' skills and creativity',
          'Highlight your salon\'s products and atmosphere'
        ],
        placeholders: {
          businessName: 'e.g., Style Studio, The Hair Lounge',
          description: 'Describe your hair salon, services, stylists\' expertise, and what makes your salon special...',
          specialOffers: 'e.g., 25% off first color service, Free consultation'
        }
      }
    };

    return contentMap[formData.category] || {
      title: `Add Your ${subdomainInfo.category} Business`,
      subtitle: `Connect with customers looking for ${subdomainInfo.category.toLowerCase()} services`,
      benefits: [
        'Increase your business visibility online',
        'Connect with local customers in your area',
        'Build credibility through customer reviews'
      ],
      placeholders: {
        businessName: 'Enter your business name',
        description: 'Describe your business, services, and what makes you unique...',
        specialOffers: 'e.g., 10% off first service, Free consultation'
      }
    };
  };

  const categoryContent = getCategorySpecificContent();

  const handleInputChange = (field: keyof BusinessFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
    
    // Clear services error when user selects a service
    if (formErrors.services) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
    }
  };

  const handleCustomServiceAdd = (service: string) => {
    if (service.trim() && !formData.customServices.includes(service.trim())) {
      setFormData(prev => ({
        ...prev,
        customServices: [...prev.customServices, service.trim()]
      }));
      
      // Clear services error when user adds a custom service
      if (formErrors.services) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.services;
          return newErrors;
        });
      }
    }
  };

  const handleCustomServiceRemove = (service: string) => {
    setFormData(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s !== service)
    }));
  };

  const handleHoursChange = (day: string, hours: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: hours }
    }));
  };

  const handleSocialMediaChange = (platform: keyof BusinessFormData['socialMedia'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  // Client-side validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Step 1 validation
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
    } else if (formData.businessName.trim().length < 2) {
      errors.businessName = 'Business name must be at least 2 characters';
    }

    if (!formData.ownerName.trim()) {
      errors.ownerName = 'Owner/Manager name is required';
    } else if (formData.ownerName.trim().length < 2) {
      errors.ownerName = 'Owner/Manager name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Step 2 validation
    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!isValidZipCode(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code';
    }

    // Step 3 validation
    const totalServices = formData.services.length + formData.customServices.length;
    if (totalServices === 0) {
      errors.services = 'Please select at least one service';
    }

    // Validate business hours
    const hasValidHours = Object.values(formData.hours).some(hours => 
      hours && hours.trim() && hours.toLowerCase() !== 'closed'
    );
    if (!hasValidHours) {
      errors.hours = 'Please specify business hours for at least one day';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Pure validation function that doesn't set state - used for checking if step is valid
  const _getStepErrors = (step: number): FormErrors => {
    const errors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          errors.businessName = 'Business name is required';
        }
        if (!formData.ownerName.trim()) {
          errors.ownerName = 'Owner/Manager name is required';
        }
        if (!formData.email.trim()) {
          errors.email = 'Email address is required';
        } else if (!isValidEmail(formData.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
          errors.phone = 'Phone number is required';
        }
        break;
      case 2:
        if (!formData.address.trim()) {
          errors.address = 'Street address is required';
        }
        if (!formData.city.trim()) {
          errors.city = 'City is required';
        }
        if (!formData.state.trim()) {
          errors.state = 'State is required';
        }
        if (!formData.zipCode.trim()) {
          errors.zipCode = 'ZIP code is required';
        }
        break;
      case 3:
        const totalServices = formData.services.length + formData.customServices.length;
        if (totalServices === 0) {
          errors.services = 'Please select at least one service';
        }
        break;
      case 4:
        // Optional step, no required fields
        break;
    }

    return errors;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const stepErrors = _getStepErrors(currentStep);
      setFormErrors(stepErrors);
      
      if (Object.keys(stepErrors).length === 0) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const businessSubmission: BusinessSubmission = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        category: formData.category,
        website: formData.website || undefined,
        description: formData.description,
        services: formData.services,
        customServices: formData.customServices,
        hours: formData.hours,
        socialMedia: formData.socialMedia,
        businessType: formData.businessType,
        yearsInBusiness: formData.yearsInBusiness,
        employeeCount: formData.employeeCount,
        specialOffers: formData.specialOffers,
        submittedAt: new Date()
      };

      const result = await dataProvider.submitBusiness(businessSubmission);
      setSubmitResult(result);

      // If there are field-specific errors from the server, map them to form errors
      if (!result.success && result.errors) {
        const serverErrors: FormErrors = {};
        result.errors.forEach(error => {
          const errorLower = error.toLowerCase();
          if (errorLower.includes('business name')) {
            serverErrors.businessName = error;
          } else if (errorLower.includes('owner') || errorLower.includes('manager')) {
            serverErrors.ownerName = error;
          } else if (errorLower.includes('email')) {
            serverErrors.email = error;
          } else if (errorLower.includes('phone')) {
            serverErrors.phone = error;
          } else if (errorLower.includes('address')) {
            serverErrors.address = error;
          } else if (errorLower.includes('city')) {
            serverErrors.city = error;
          } else if (errorLower.includes('state')) {
            serverErrors.state = error;
          } else if (errorLower.includes('zip')) {
            serverErrors.zipCode = error;
          } else if (errorLower.includes('service')) {
            serverErrors.services = error;
          }
        });
        setFormErrors(serverErrors);
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitResult(null);
    setCurrentStep(1);
    setFormErrors({});
    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      city: subdomainInfo.city,
      state: subdomainInfo.state,
      zipCode: '',
      category: subdomainInfo.category.toLowerCase().replace(/\s+/g, '-'),
      website: '',
      description: '',
      services: [],
      hours: {
        Monday: '9:00 AM - 5:00 PM',
        Tuesday: '9:00 AM - 5:00 PM',
        Wednesday: '9:00 AM - 5:00 PM',
        Thursday: '9:00 AM - 5:00 PM',
        Friday: '9:00 AM - 5:00 PM',
        Saturday: '10:00 AM - 4:00 PM',
        Sunday: 'Closed'
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      businessType: 'individual',
      yearsInBusiness: '',
      employeeCount: '',
      specialOffers: '',
      customServices: []
    });
  };

  // Validation helper functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
  };

  const isValidZipCode = (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  // Show success page
  if (submitResult?.success) {
    return (
      <SubmissionSuccess 
        result={submitResult} 
        onReset={resetForm}
        category={subdomainInfo.category}
        city={subdomainInfo.city}
      />
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
              <p className="text-gray-600">Tell us about your {subdomainInfo.category.toLowerCase()} business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder={categoryContent.placeholders.businessName}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.businessName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.businessName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner/Manager Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.ownerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.ownerName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.ownerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@yourbusiness.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={categoryContent.placeholders.description}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourbusiness.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Information</h2>
              <p className="text-gray-600">Where can customers find your business?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {formErrors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="TX"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.state && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.state}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="75201"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    formErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.zipCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.zipCode}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="individual">Independent Business</option>
                  <option value="franchise">Franchise</option>
                  <option value="chain">Chain/Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business
                </label>
                <select
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select years</option>
                  <option value="less-than-1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="more-than-10">More than 10 years</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Hours</h2>
              <p className="text-gray-600">What services do you offer and when are you open?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Services Offered * (Select all that apply)
              </label>
              {formErrors.services && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.services}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getAvailableServices().map((service, index) => (
                  <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={(e) => handleServiceToggle(service, e.target.checked)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Services (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.customServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => handleCustomServiceRemove(service)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom service"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomServiceAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    handleCustomServiceAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Hours
              </label>
              {formErrors.hours && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.hours}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {Object.entries(formData.hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </div>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleHoursChange(day, e.target.value)}
                      placeholder="9:00 AM - 5:00 PM or Closed"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Help customers learn more about your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Page
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourbusiness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Profile
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourbusiness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Profile
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourbusiness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Offers or Promotions
              </label>
              <textarea
                value={formData.specialOffers}
                onChange={(e) => handleInputChange('specialOffers', e.target.value)}
                placeholder={categoryContent.placeholders.specialOffers}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <select
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select employee count</option>
                <option value="1">Just me</option>
                <option value="2-5">2-5 employees</option>
                <option value="6-10">6-10 employees</option>
                <option value="11-25">11-25 employees</option>
                <option value="26-50">26-50 employees</option>
                <option value="50+">50+ employees</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {categoryContent.title}
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            {categoryContent.subtitle} in {subdomainInfo.city}, {subdomainInfo.state}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-200">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-blue-200">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {submitResult && !submitResult.success && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Submission Failed</h3>
                    <p className="text-red-700 text-sm mt-1 whitespace-pre-line">{submitResult.message}</p>
                    {submitResult.errors && submitResult.errors.length > 0 && (
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {submitResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={Object.keys(_getStepErrors(currentStep)).length > 0}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why List Your Business?</h3>
              <div className="space-y-4">
                {categoryContent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Call Us</div>
                    <a href="tel:+15551234567" className="text-sm text-blue-600 hover:text-blue-700">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Email Us</div>
                    <a href="mailto:support@near-me.us" className="text-sm text-blue-600 hover:text-blue-700">
                      support@near-me.us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Join Our Network</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Businesses</span>
                  <span className="text-lg font-bold text-blue-600">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Visitors</span>
                  <span className="text-lg font-bold text-blue-600">50K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Connections</span>
                  <span className="text-lg font-bold text-blue-600">10K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessPage;