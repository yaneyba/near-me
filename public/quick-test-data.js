// Quick Test Data for Admin Dashboard
// Instructions: 
// 1. Open the admin dashboard (http://localhost:5173/admin/dashboard)
// 2. Open browser console (F12 -> Console tab)  
// 3. Copy and paste this ENTIRE script and press Enter
// 4. Wait for "SUCCESS" message and page refresh

console.log('🚀 Loading test data script...');

// Create the test data function
window.addQuickTestData = async function() {
  try {
    console.log('📦 Starting to add test data...');
    
    // Import Supabase client
    const supabaseModule = await import('/src/lib/supabase.ts');
    const { supabase } = supabaseModule;
    
    if (!supabase) {
      throw new Error('Failed to load Supabase client');
    }
    
    console.log('✅ Supabase client loaded');
    
    // Add business submissions
    console.log('📋 Adding business submissions...');
    const submissions = [
      {
        business_name: "Mario's Pizza",
        owner_name: "Mario Rossi", 
        email: "mario@mariospizza.com",
        phone: "(512) 555-0101",
        address: "100 Congress Ave",
        city: "Austin",
        state: "TX", 
        zip_code: "78701",
        category: "restaurants",
        website: "https://mariospizza.com",
        description: "Authentic Italian pizza and pasta",
        services: ["dine-in", "delivery"],
        site_id: "near-me-us",
        status: "pending"
      },
      {
        business_name: "Tech Repair Shop",
        owner_name: "John Tech",
        email: "john@techrepair.com", 
        phone: "(512) 555-0202",
        address: "200 Main St",
        city: "Austin",
        state: "TX",
        zip_code: "78702", 
        category: "electronics",
        description: "Computer and phone repair services",
        services: ["repair", "support"],
        site_id: "near-me-us",
        status: "approved"
      }
    ];
    
    const { data: submissionResult, error: submissionError } = await supabase
      .from('business_submissions')
      .insert(submissions);
      
    if (submissionError) {
      console.error('❌ Submission error:', submissionError);
    } else {
      console.log('✅ Business submissions added');
    }
    
    // Add contact messages  
    console.log('💬 Adding contact messages...');
    const messages = [
      {
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Business inquiry", 
        message: "I would like to add my restaurant to your directory",
        category: "restaurants",
        city: "Austin",
        status: "new"
      },
      {
        name: "Bob Smith", 
        email: "bob@example.com",
        subject: "Technical support",
        message: "Having trouble with my business listing",
        city: "Austin", 
        status: "new"
      }
    ];
    
    const { data: messageResult, error: messageError } = await supabase
      .from('contact_messages') 
      .insert(messages);
      
    if (messageError) {
      console.error('❌ Message error:', messageError);
    } else {
      console.log('✅ Contact messages added');
    }
    
    console.log('🎉 SUCCESS! Test data added successfully!');
    console.log('🔄 Refreshing page in 2 seconds...');
    
    setTimeout(() => {
      location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ FAILED to add test data:', error);
    console.log('Please check:');
    console.log('1. You are logged in as admin');
    console.log('2. You are on the admin dashboard page');
    console.log('3. Database connection is working');
  }
};

// Also expose a simpler version
window.quickTest = function() {
  window.addQuickTestData();
};

console.log('✅ Test data functions ready!');
console.log('📝 Run: addQuickTestData() or quickTest()');
console.log('');
console.log('🎯 QUICK START: Just type "quickTest()" and press Enter!');
