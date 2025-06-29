// Test script to add sample business submissions
// Run this in the browser console or as a separate script

import { supabase } from '../src/lib/supabase.js';

const sampleSubmissions = [
  {
    business_name: 'Elite Nail Spa',
    owner_name: 'Sarah Johnson',
    email: 'sarah@elitenailspa.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'Dallas',
    state: 'Texas',
    zip_code: '75201',
    category: 'nail-salons',
    website: 'https://elitenailspa.com',
    description: 'Premium nail salon offering manicures, pedicures, and nail art.',
    services: ['Manicures', 'Pedicures', 'Nail Art', 'Gel Extensions'],
    hours: {
      'Monday': '9:00 AM - 7:00 PM',
      'Tuesday': '9:00 AM - 7:00 PM',
      'Wednesday': '9:00 AM - 7:00 PM',
      'Thursday': '9:00 AM - 7:00 PM',
      'Friday': '9:00 AM - 8:00 PM',
      'Saturday': '9:00 AM - 8:00 PM',
      'Sunday': '10:00 AM - 6:00 PM'
    },
    status: 'pending',
    site_id: 'near-me-us'
  },
  {
    business_name: 'Quick Fix Auto Repair',
    owner_name: 'Mike Rodriguez',
    email: 'mike@quickfixauto.com',
    phone: '(555) 987-6543',
    address: '456 Oak Avenue',
    city: 'Austin',
    state: 'Texas',
    zip_code: '73301',
    category: 'auto-repair',
    website: 'https://quickfixauto.com',
    description: 'Professional auto repair services for all makes and models.',
    services: ['Oil Changes', 'Brake Service', 'Engine Repair', 'Diagnostics'],
    hours: {
      'Monday': '8:00 AM - 6:00 PM',
      'Tuesday': '8:00 AM - 6:00 PM',
      'Wednesday': '8:00 AM - 6:00 PM',
      'Thursday': '8:00 AM - 6:00 PM',
      'Friday': '8:00 AM - 6:00 PM',
      'Saturday': '8:00 AM - 4:00 PM',
      'Sunday': 'Closed'
    },
    status: 'pending',
    site_id: 'near-me-us'
  },
  {
    business_name: 'Bella Vista Restaurant',
    owner_name: 'Maria Gonzalez',
    email: 'maria@bellavista.com',
    phone: '(555) 456-7890',
    address: '789 Pine Street',
    city: 'Houston',
    state: 'Texas',
    zip_code: '77001',
    category: 'restaurants',
    website: 'https://bellavista.com',
    description: 'Authentic Italian cuisine in a cozy family atmosphere.',
    services: ['Dine-in', 'Takeout', 'Catering', 'Private Events'],
    hours: {
      'Monday': 'Closed',
      'Tuesday': '11:00 AM - 9:00 PM',
      'Wednesday': '11:00 AM - 9:00 PM',
      'Thursday': '11:00 AM - 9:00 PM',
      'Friday': '11:00 AM - 10:00 PM',
      'Saturday': '11:00 AM - 10:00 PM',
      'Sunday': '12:00 PM - 8:00 PM'
    },
    status: 'pending',
    site_id: 'near-me-us'
  }
];

async function addSampleSubmissions() {
  console.log('Adding sample business submissions...');
  
  try {
    const { data, error } = await supabase
      .from('business_submissions')
      .insert(sampleSubmissions);
    
    if (error) {
      console.error('Error adding submissions:', error);
      return;
    }
    
    console.log('Sample submissions added successfully:', data);
  } catch (err) {
    console.error('Failed to add submissions:', err);
  }
}

// Run the function
addSampleSubmissions();
