// Test data script for Admin Dashboard
// Run this from the browser console when logged in as admin

const addTestBusinessSubmissions = async () => {
  const { supabase } = await import('/src/lib/supabase.ts');
  
  const testSubmissions = [
    {
      business_name: "Joe's Pizza Palace",
      owner_name: "Joe Smith",
      email: "joe@pizzapalace.com",
      phone: "(555) 123-4567",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zip_code: "78701",
      category: "restaurants",
      website: "https://joespizzapalace.com",
      description: "Authentic Italian pizza made with fresh ingredients. Family-owned and operated since 1985.",
      services: ["dine-in", "takeout", "delivery"],
      hours: {
        monday: "11:00 AM - 10:00 PM",
        tuesday: "11:00 AM - 10:00 PM",
        wednesday: "11:00 AM - 10:00 PM",
        thursday: "11:00 AM - 10:00 PM",
        friday: "11:00 AM - 11:00 PM",
        saturday: "11:00 AM - 11:00 PM",
        sunday: "12:00 PM - 9:00 PM"
      },
      site_id: "near-me-us",
      status: "pending"
    },
    {
      business_name: "Austin Hair Studio",
      owner_name: "Sarah Johnson",
      email: "sarah@austinhairstudio.com",
      phone: "(555) 987-6543",
      address: "456 Oak Avenue",
      city: "Austin",
      state: "TX",
      zip_code: "78702",
      category: "beauty-salons",
      website: "https://austinhairstudio.com",
      description: "Full-service hair salon offering cuts, color, styling, and treatments for all hair types.",
      services: ["haircuts", "coloring", "styling", "treatments"],
      hours: {
        monday: "Closed",
        tuesday: "9:00 AM - 7:00 PM",
        wednesday: "9:00 AM - 7:00 PM",
        thursday: "9:00 AM - 7:00 PM",
        friday: "9:00 AM - 7:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 4:00 PM"
      },
      site_id: "near-me-us",
      status: "pending"
    },
    {
      business_name: "Austin Auto Repair",
      owner_name: "Mike Wilson",
      email: "mike@austinautorepair.com",
      phone: "(555) 456-7890",
      address: "789 Industrial Blvd",
      city: "Austin",
      state: "TX",
      zip_code: "78703",
      category: "automotive",
      website: "https://austinautorepair.com",
      description: "Professional automotive repair and maintenance services. ASE certified technicians.",
      services: ["oil-changes", "brake-repair", "engine-diagnostics", "transmission-repair"],
      hours: {
        monday: "7:00 AM - 6:00 PM",
        tuesday: "7:00 AM - 6:00 PM",
        wednesday: "7:00 AM - 6:00 PM",
        thursday: "7:00 AM - 6:00 PM",
        friday: "7:00 AM - 6:00 PM",
        saturday: "8:00 AM - 4:00 PM",
        sunday: "Closed"
      },
      site_id: "near-me-us",
      status: "approved"
    }
  ];

  try {
    const { data, error } = await supabase
      .from('business_submissions')
      .insert(testSubmissions);
    
    if (error) {
      console.error('Error adding test submissions:', error);
    } else {
      console.log('Test business submissions added successfully:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const addTestContactMessages = async () => {
  const { supabase } = await import('/src/lib/supabase.ts');
  
  const testMessages = [
    {
      name: "Jennifer Davis",
      email: "jennifer.davis@email.com",
      subject: "Question about business listing",
      message: "Hi, I'm interested in adding my bakery to your directory. Can you provide more information about the process and pricing?",
      category: "restaurants",
      city: "Austin",
      status: "new"
    },
    {
      name: "Robert Chen",
      email: "robert.chen@email.com",
      subject: "Technical issue with website",
      message: "I'm experiencing problems accessing my business dashboard. The page won't load properly and I can't update my business information.",
      category: null,
      city: "Austin",
      status: "in_progress"
    },
    {
      name: "Maria Rodriguez",
      email: "maria.rodriguez@email.com",
      subject: "Request for feature enhancement",
      message: "Would it be possible to add a calendar booking system integration? Many of my customers ask about online appointment scheduling.",
      category: "beauty-salons",
      city: "Austin",
      status: "new"
    },
    {
      name: "David Park",
      email: "david.park@email.com",
      subject: "Thank you for the great service",
      message: "Just wanted to say thank you for helping me get my business listed. The increased visibility has really helped drive more customers to my store.",
      category: "retail",
      city: "Austin",
      status: "resolved"
    }
  ];

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(testMessages);
    
    if (error) {
      console.error('Error adding test messages:', error);
    } else {
      console.log('Test contact messages added successfully:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Helper function to run both
const addAllTestData = async () => {
  console.log('Adding test business submissions...');
  await addTestBusinessSubmissions();
  console.log('Adding test contact messages...');
  await addTestContactMessages();
  console.log('All test data added successfully!');
};

// Export functions for use in browser console
window.addTestBusinessSubmissions = addTestBusinessSubmissions;
window.addTestContactMessages = addTestContactMessages;
window.addAllTestData = addAllTestData;

console.log('Test data functions loaded. Available functions:');
console.log('- addTestBusinessSubmissions()');
console.log('- addTestContactMessages()');
console.log('- addAllTestData()');
