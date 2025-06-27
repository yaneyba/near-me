// Admin Dashboard Test Data Script
// Copy and paste this entire script into the browser console while on the admin dashboard

async function addTestData() {
  console.log('🚀 Starting to add test data...');
  
  try {
    // Import Supabase
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // Test Business Submissions
    console.log('📋 Adding business submissions...');
    const businessSubmissions = [
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
        description: "Authentic Italian pizza made with fresh ingredients since 1985.",
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
        description: "Full-service hair salon offering cuts, color, styling, and treatments.",
        services: ["haircuts", "coloring", "styling", "treatments"],
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
        description: "Professional automotive repair and maintenance services.",
        services: ["oil-changes", "brake-repair", "diagnostics"],
        site_id: "near-me-us",
        status: "approved"
      },
      {
        business_name: "Downtown Fitness Center",
        owner_name: "Lisa Chen",
        email: "lisa@downtownfitness.com",
        phone: "(555) 321-9876",
        address: "321 Fitness Lane",
        city: "Austin",
        state: "TX",
        zip_code: "78704",
        category: "fitness",
        description: "State-of-the-art fitness facility with personal training available.",
        services: ["gym", "personal-training", "group-classes"],
        site_id: "near-me-us",
        status: "rejected"
      }
    ];

    const { data: submissionData, error: submissionError } = await supabase
      .from('business_submissions')
      .insert(businessSubmissions)
      .select();

    if (submissionError) {
      console.error('❌ Error adding business submissions:', submissionError);
    } else {
      console.log('✅ Added', submissionData.length, 'business submissions');
    }

    // Test Contact Messages
    console.log('💬 Adding contact messages...');
    const contactMessages = [
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
        message: "I'm experiencing problems accessing my business dashboard. The page won't load properly.",
        city: "Austin",
        status: "new"
      },
      {
        name: "Maria Rodriguez",
        email: "maria.rodriguez@email.com",
        subject: "Feature request",
        message: "Would it be possible to add a calendar booking system integration?",
        category: "beauty-salons",
        city: "Austin",
        status: "in_progress"
      },
      {
        name: "David Park",
        email: "david.park@email.com",
        subject: "Thank you",
        message: "Just wanted to say thank you for helping me get my business listed. Great service!",
        category: "retail",
        city: "Austin",
        status: "resolved"
      }
    ];

    const { data: messageData, error: messageError } = await supabase
      .from('contact_messages')
      .insert(contactMessages)
      .select();

    if (messageError) {
      console.error('❌ Error adding contact messages:', messageError);
    } else {
      console.log('✅ Added', messageData.length, 'contact messages');
    }

    // Test Business Profiles (Users)
    console.log('👥 Adding business profiles...');
    const businessProfiles = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        business_name: "Joe's Pizza Palace",
        email: "joe@pizzapalace.com",
        role: "owner",
        premium: false
      },
      {
        user_id: '00000000-0000-0000-0000-000000000002',
        business_name: "Austin Hair Studio",
        email: "sarah@austinhairstudio.com",
        role: "owner",
        premium: true
      },
      {
        user_id: '00000000-0000-0000-0000-000000000003',
        business_name: "Austin Auto Repair",
        email: "mike@austinautorepair.com",
        role: "owner",
        premium: false
      }
    ];

    const { data: profileData, error: profileError } = await supabase
      .from('business_profiles')
      .insert(businessProfiles)
      .select();

    if (profileError) {
      console.error('❌ Error adding business profiles:', profileError);
      console.log('Note: This might fail due to foreign key constraints - that\'s okay for testing');
    } else {
      console.log('✅ Added', profileData.length, 'business profiles');
    }

    console.log('🎉 Test data added successfully!');
    console.log('📊 Refresh the page to see the data in the dashboard');
    
    // Auto-refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('❌ Error adding test data:', error);
  }
}

// Run the function
addTestData();
