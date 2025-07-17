/**
 * Test script for Slack notifications
 * This script can be run to test the Slack notification system
 */

import { sendSlackNotification, ContactNotificationData, BusinessNotificationData } from './slack';

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// Test contact form notification
const testContactNotification = async () => {
  console.log('Testing contact form notification...');
  
  const contactData: ContactNotificationData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message to verify that Slack notifications are working correctly for contact form submissions.',
    inquiryType: 'general',
    businessName: 'Test Business',
    category: 'auto-repair',
    city: 'Dallas',
    state: 'TX',
    urgency: 'normal',
    preferredContact: 'email',
  };

  try {
    await sendSlackNotification(SLACK_WEBHOOK_URL, {
      type: 'contact',
      data: contactData,
      submissionId: 'test_contact_' + Date.now(),
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Contact notification sent successfully');
  } catch (error) {
    console.error('❌ Contact notification failed:', error);
  }
};

// Test business submission notification
const testBusinessNotification = async () => {
  console.log('Testing business submission notification...');
  
  const businessData: BusinessNotificationData = {
    businessName: 'Test Auto Repair Shop',
    ownerName: 'John Doe',
    email: 'john@testautoshop.com',
    phone: '(555) 987-6543',
    address: '123 Main St',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    category: 'auto-repair',
    website: 'https://testautoshop.com',
    description: 'Full-service auto repair shop with certified mechanics and quality parts.',
    services: ['Oil Changes', 'Brake Repair', 'Engine Diagnostics', 'Transmission Service'],
    submitterName: 'John Doe',
    submitterEmail: 'john@testautoshop.com',
    submitterPhone: '(555) 987-6543',
  };

  try {
    await sendSlackNotification(SLACK_WEBHOOK_URL, {
      type: 'business',
      data: businessData,
      submissionId: 'test_business_' + Date.now(),
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Business notification sent successfully');
  } catch (error) {
    console.error('❌ Business notification failed:', error);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Slack notification tests...\n');
  
  await testContactNotification();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  
  await testBusinessNotification();
  
  console.log('\n✨ All tests completed');
};

// Execute tests if run directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { testContactNotification, testBusinessNotification, runTests };
