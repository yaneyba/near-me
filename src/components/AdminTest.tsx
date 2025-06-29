import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TestResult {
  name: string;
  passed: boolean;
  data: any;
  error: any;
}

const AdminTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const addResult = (name: string, passed: boolean, data: any = null, error: any = null) => {
    setResults(prev => [...prev, { name, passed, data, error }]);
  };

  // Copy result data to clipboard
  const copyToClipboard = async (result: TestResult, index: number) => {
    try {
      const resultData = {
        name: result.name,
        passed: result.passed,
        timestamp: new Date().toISOString(),
        data: result.data,
        error: result.error ? {
          message: result.error.message,
          code: result.error.code,
          details: result.error.details,
          hint: result.error.hint
        } : null
      };

      const copyText = JSON.stringify(resultData, null, 2);
      await navigator.clipboard.writeText(copyText);
      
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback: select text for manual copy
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(result, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Copy all results to clipboard
  const copyAllResults = async () => {
    try {
      const allResults = {
        timestamp: new Date().toISOString(),
        totalTests: results.length,
        passedTests: results.filter(r => r.passed).length,
        failedTests: results.filter(r => !r.passed).length,
        results: results.map(result => ({
          name: result.name,
          passed: result.passed,
          data: result.data,
          error: result.error ? {
            message: result.error.message,
            code: result.error.code,
            details: result.error.details,
            hint: result.error.hint
          } : null
        }))
      };

      const copyText = JSON.stringify(allResults, null, 2);
      await navigator.clipboard.writeText(copyText);
      
      setCopiedIndex(-1); // Use -1 to indicate "copy all" was used
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy all results:', err);
    }
  };

  // Test RLS policies summary (Updated with correct tables)
  const testRLSPolicies = async () => {
    try {
      // Test what works and what doesn't with actual near-me.us tables
      const results = {
        businessSubmissionsRead: false,
        categoriesRead: false,
        citiesRead: false,
        contactMessagesRead: false,
        adminSettingsRead: false,
        businessSubmissionsWrite: false
      };

      // Test business_submissions read
      const { error: businessError } = await supabase
        .from('business_submissions')
        .select('id')
        .limit(1);
      results.businessSubmissionsRead = !businessError;

      // Test categories read  
      const { error: categoriesError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      results.categoriesRead = !categoriesError;

      // Test cities read
      const { error: citiesError } = await supabase
        .from('cities')
        .select('id')
        .limit(1);
      results.citiesRead = !citiesError;

      // Test contact_messages read
      const { error: contactReadError } = await supabase
        .from('contact_messages')
        .select('id')
        .limit(1);
      results.contactMessagesRead = !contactReadError;

      // Test admin_settings read
      const { error: adminError } = await supabase
        .from('admin_settings')
        .select('id')
        .limit(1);
      results.adminSettingsRead = !adminError;

      // Test business_submissions write
      const { error: contactWriteError } = await supabase
        .from('business_submissions')
        .insert([{
          business_name: 'RLS Test Business',
          owner_name: 'RLS Test Owner',
          email: 'rlstest@example.com',
          phone: '(555) 123-4567',
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip_code: '12345',
          category: 'test',
          website: 'https://test.com',
          description: 'RLS policy test',
          site_id: 'test-site'
        }])
        .select('id');
      results.businessSubmissionsWrite = !contactWriteError;

      // Clean up test data if write succeeded
      if (!contactWriteError && contactWriteError !== null) {
        try {
          await supabase
            .from('business_submissions')
            .delete()
            .eq('email', 'rlstest@example.com');
        } catch (cleanupErr) {
          console.log('Cleanup failed, but test succeeded');
        }
      }

      const allPassed = Object.values(results).every(Boolean);
      addResult('RLS Policies Summary', allPassed, results);
    } catch (err) {
      addResult('RLS Policies Summary', false, null, err);
    }
  };

  // Test if tables exist (Updated with correct near-me.us tables)
  const testTablesExist = async () => {
    try {
      const tables = [
        'business_submissions', 
        'categories', 
        'cities', 
        'businesses', 
        'contact_messages', 
        'admin_settings',
        'business_profiles',
        'user_engagement_events'
      ];
      const results: Record<string, string> = {};
      
      for (const table of tables) {
        try {
          // Use a simpler approach - just try to select with limit 0
          const { error } = await supabase
            .from(table)
            .select('*')
            .limit(0);
          
          if (!error) {
            results[table] = 'exists';
          } else {
            // Provide detailed error information
            const errorMsg = error.message || 'Unknown error';
            const errorCode = error.code || 'NO_CODE';
            const errorHint = error.hint || '';
            
            if (errorCode === '42P01') {
              results[table] = 'table does not exist';
            } else if (errorCode === '42501') {
              results[table] = 'exists but access denied (RLS policy needed)';
            } else {
              results[table] = `error: ${errorCode} - ${errorMsg}${errorHint ? ` (${errorHint})` : ''}`;
            }
          }
        } catch (err: any) {
          // Handle JavaScript/network errors
          const errorMsg = err.message || 'Unknown JavaScript error';
          results[table] = `js_error: ${errorMsg}`;
          console.error(`Table check error for ${table}:`, err);
        }
      }
      
      const allExist = Object.values(results).every(result => result === 'exists');
      const someExist = Object.values(results).some(result => result === 'exists' || result.includes('access denied'));
      
      // Create summary for better understanding
      const summary = {
        tablesFound: Object.entries(results).filter(([_, status]) => status === 'exists').length,
        tablesWithRLSIssues: Object.entries(results).filter(([_, status]) => status.includes('access denied')).length,
        tablesMissing: Object.entries(results).filter(([_, status]) => status.includes('does not exist')).length,
        tablesWithErrors: Object.entries(results).filter(([_, status]) => status.startsWith('error:') || status.startsWith('js_error:')).length,
        details: results,
        analysis: someExist ? 'Database connection appears to be working' : 'Database connection or authentication issues'
      };
      
      addResult('Tables Existence Check', allExist, summary, allExist ? null : new Error('Some tables are not accessible'));
    } catch (err: any) {
      console.error('Tables existence check failed:', err);
      addResult('Tables Existence Check', false, { 
        error: 'Failed to run table existence check',
        details: err.message || 'Unknown error'
      }, err);
    }
  };

  // Test basic connection (FIXED VERSION)
  const testBasicConnection = async () => {
    try {
      // Test 1: Try a simple query that should always work
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1);
      
      if (!error) {
        addResult('Basic Connection', true, { 
          connected: true,
          message: 'Connection successful - can query database schema',
          tablesFound: data?.length || 0
        }, null);
        return;
      }

      // Test 2: If schema query fails, try our JWT debug function
      try {
        const { data: jwtData, error: jwtError } = await supabase.rpc('debug_my_jwt');
        
        if (!jwtError) {
          addResult('Basic Connection', true, { 
            connected: true,
            message: 'Connection successful via JWT debug function',
            hasJWT: !!jwtData
          }, null);
          return;
        }
      } catch (jwtErr) {
        // JWT debug also failed, continue to fallback
      }

      // Test 3: Final fallback - try to access any existing table
      const fallbackTables = ['business_submissions', 'categories', 'cities', 'businesses'];
      let connectionWorked = false;
      
      for (const table of fallbackTables) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('*')
            .limit(0); // Don't actually fetch data, just test connection
          
          if (!tableError || tableError.code !== '42P01') { // 42P01 = table doesn't exist
            connectionWorked = true;
            addResult('Basic Connection', true, { 
              connected: true,
              message: `Connection successful - accessed table: ${table}`,
              method: 'table_access_test'
            }, null);
            break;
          }
        } catch (tableErr) {
          continue; // Try next table
        }
      }

      if (!connectionWorked) {
        addResult('Basic Connection', false, { 
          connected: false,
          error: 'All connection methods failed',
          lastError: error.message
        }, error);
      }

    } catch (err: any) {
      addResult('Basic Connection', false, { 
        connected: false,
        error: err.message || 'Unknown connection error'
      }, err);
    }
  };

  // Test current role
  const testCurrentRole = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_role');
      addResult('Current Role Test', !error, data, error);
    } catch (err) {
      addResult('Current Role Test', false, null, err);
    }
  };

  // Test simple role (alternative to current role)
  const testSimpleRole = async () => {
    try {
      const { data, error } = await supabase.rpc('get_simple_role');
      addResult('Simple Role Test', !error, data, error);
    } catch (err) {
      addResult('Simple Role Test', false, null, err);
    }
  };

  // Test minimal role (most compatible version)
  const testMinimalRole = async () => {
    try {
      const { data, error } = await supabase.rpc('get_minimal_role');
      addResult('Minimal Role Test', !error, data, error);
    } catch (err) {
      addResult('Minimal Role Test', false, null, err);
    }
  };

  // Test JWT debug function
  const testJWTDebug = async () => {
    try {
      const { data, error } = await supabase.rpc('debug_my_jwt');
      if (error) {
        addResult('JWT Debug Test', false, null, error);
      } else {
        // Analyze the JWT data
        const jwtAnalysis = {
          fullJWT: data,
          email: data?.email || 'Not found',
          role: data?.role || 'Not found',
          user_metadata: data?.user_metadata || {},
          app_metadata: data?.app_metadata || {},
          hasAdminRole: false,
          adminRoleLocation: 'none'
        };

        // Check where admin role might be
        if (data?.user_metadata?.role === 'admin') {
          jwtAnalysis.hasAdminRole = true;
          jwtAnalysis.adminRoleLocation = 'user_metadata.role';
        } else if (data?.app_metadata?.role === 'admin') {
          jwtAnalysis.hasAdminRole = true;
          jwtAnalysis.adminRoleLocation = 'app_metadata.role';
        } else if (data?.role === 'admin') {
          jwtAnalysis.hasAdminRole = true;
          jwtAnalysis.adminRoleLocation = 'root.role';
        }

        addResult('JWT Debug Test', true, jwtAnalysis, null);
      }
    } catch (err) {
      addResult('JWT Debug Test', false, null, err);
    }
  };

  // Comprehensive RLS diagnostic test
  const testRLSDiagnostic = async () => {
    try {
      const diagnostics: any = {
        table: 'business_submissions', // Changed from contact_submissions
        timestamp: new Date().toISOString(),
        tests: {},
        policies: null,
        recommendations: [],
        currentRole: null,
        connectionInfo: null
      };

      // Test 0: Get current role and connection information
      try {
        const { data: roleData, error: roleError } = await supabase.rpc('get_current_role');
        if (!roleError && roleData) {
          diagnostics.currentRole = {
            current_user: roleData.current_user,
            current_role: roleData.current_role,
            session_user: roleData.session_user,
            is_superuser: roleData.is_superuser,
            role_attributes: roleData.role_attributes
          };
        } else {
          // Fallback: Try to get basic role info
          try {
            const { data: simpleRole, error: simpleError } = await supabase.rpc('get_simple_role');
            if (!simpleError && simpleRole) {
              diagnostics.currentRole = simpleRole;
            }
          } catch {
            diagnostics.currentRole = { error: 'Unable to determine current role' };
          }
        }
      } catch (err) {
        diagnostics.currentRole = { error: 'Role detection failed' };
      }

      // Add connection method detection
      const envInfo = {
        usingAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        usingServiceKey: !!import.meta.env.SUPABASE_SERVICE_KEY,
        dataProvider: import.meta.env.VITE_DATA_PROVIDER,
        keyType: 'Unknown'
      };

      // Determine which key is likely being used based on role
      if (diagnostics.currentRole?.current_user === 'anon' || diagnostics.currentRole?.current_role === 'anon') {
        envInfo.keyType = 'ANON_KEY (anonymous users)';
      } else if (diagnostics.currentRole?.current_user === 'service_role' || diagnostics.currentRole?.current_role === 'service_role') {
        envInfo.keyType = 'SERVICE_KEY (elevated privileges)';
      } else if (diagnostics.currentRole?.current_user === 'authenticated') {
        envInfo.keyType = 'AUTHENTICATED (logged-in user)';
      } else if (diagnostics.currentRole?.current_user === 'postgres') {
        envInfo.keyType = 'POSTGRES (superuser)';
      }

      diagnostics.connectionInfo = envInfo;

      // Test 1: Check if RLS is enabled
      try {
        const { data: rlsStatus, error: rlsError } = await supabase.rpc('get_table_rls_status', { 
          table_name: 'business_submissions' 
        });
        
        if (rlsError && rlsError.code === '42883') {
          // Function doesn't exist, let's create a simpler check
          diagnostics.tests.rlsEnabled = 'Unable to check (function missing)';
        } else {
          diagnostics.tests.rlsEnabled = rlsStatus;
        }
      } catch (err) {
        diagnostics.tests.rlsEnabled = 'Error checking RLS status';
      }

      // Test 2: Try to query existing policies
      try {
        const { data: policies, error: policiesError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'business_submissions');
        
        if (policiesError) {
          // Try alternative approach using RPC if available
          try {
            const { data: altPolicies, error: altError } = await supabase.rpc('get_table_policies', {
              table_name: 'business_submissions'
            });
            diagnostics.policies = altError ? null : altPolicies;
          } catch {
            diagnostics.policies = null;
          }
        } else {
          diagnostics.policies = policies;
        }
      } catch (err) {
        diagnostics.policies = null;
      }

      // Test 3: Test INSERT operation on business_submissions
      try {
        const testData = {
          business_name: `RLS Test Business ${Date.now()}`,
          owner_name: 'RLS Test Owner',
          email: `rlstest${Date.now()}@example.com`,
          phone: '(555) 123-4567',
          address: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zip_code: '12345',
          category: 'test',
          website: 'https://test.com',
          description: 'Automated RLS diagnostic test',
          site_id: 'rls-test'
        };

        const { data, error } = await supabase
          .from('business_submissions')
          .insert([testData])
          .select('id');

        diagnostics.tests.insertTest = {
          success: !error,
          error: error ? {
            code: error.code,
            message: error.message,
            hint: error.hint,
            details: error.details
          } : null,
          insertedId: data?.[0]?.id || null
        };

        // Clean up test data if insert succeeded
        if (data?.[0]?.id) {
          try {
            await supabase
              .from('business_submissions')
              .delete()
              .eq('id', data[0].id);
            diagnostics.tests.cleanupSuccess = true;
          } catch {
            diagnostics.tests.cleanupSuccess = false;
          }
        }
      } catch (err: any) {
        diagnostics.tests.insertTest = {
          success: false,
          error: {
            message: err.message,
            code: err.code || 'UNKNOWN'
          }
        };
      }

      // Test 4: Test SELECT operation on business_submissions
      try {
        const { error, count } = await supabase
          .from('business_submissions')
          .select('id', { count: 'exact' })
          .limit(1);

        diagnostics.tests.selectTest = {
          success: !error,
          count: count,
          error: error ? {
            code: error.code,
            message: error.message
          } : null
        };
      } catch (err: any) {
        diagnostics.tests.selectTest = {
          success: false,
          error: { message: err.message }
        };
      }

      // Generate recommendations based on test results and current role
      const currentRole = diagnostics.currentRole?.current_role || diagnostics.currentRole?.current_user || 'unknown';
      const isSuperuser = diagnostics.currentRole?.is_superuser === true;
      
      if (!diagnostics.tests.insertTest?.success) {
        const errorCode = diagnostics.tests.insertTest?.error?.code;
        
        if (errorCode === '42501') {
          let policyTarget = 'public';
          let explanation = 'for anonymous users';
          
          if (currentRole === 'postgres' && !isSuperuser) {
            policyTarget = 'postgres';
            explanation = 'for postgres role (Supabase managed - RLS still applies)';
          } else if (currentRole === 'service_role') {
            policyTarget = 'service_role';
            explanation = 'for service_role (you are using SERVICE_KEY)';
          } else if (currentRole === 'authenticated') {
            policyTarget = 'authenticated';
            explanation = 'for authenticated users';
          } else if (currentRole === 'postgres' && isSuperuser) {
            explanation = 'postgres superuser - RLS should be bypassed (check if RLS is force-enabled)';
            policyTarget = 'postgres';
          }
          
          diagnostics.recommendations.push({
            issue: `RLS Policy Violation (Role: ${currentRole}, Superuser: ${isSuperuser})`,
            solution: `Create an INSERT policy ${explanation}`,
            sql: `CREATE POLICY "business_submissions_insert_${policyTarget}" ON "public"."business_submissions" FOR INSERT TO ${policyTarget} WITH CHECK (true);`,
            priority: 'HIGH',
            roleContext: currentRole === 'postgres' && !isSuperuser 
              ? `You are connecting as 'postgres' but is_superuser=false. This is typical in Supabase where RLS still applies to the postgres role.`
              : `You are connecting as '${currentRole}' - this determines which RLS policies apply.`
          });
        }
        
        if (!diagnostics.policies || diagnostics.policies.length === 0) {
          const policyRecommendation = currentRole === 'service_role' 
            ? `-- Service role policies (you are using SERVICE_KEY)\nCREATE POLICY "business_submissions_service_all" ON "public"."business_submissions"\nFOR ALL TO service_role\nUSING (true)\nWITH CHECK (true);`
            : `-- Public and service role policies\nCREATE POLICY "business_submissions_public_insert" ON "public"."business_submissions"\nFOR INSERT TO public\nWITH CHECK (true);\n\nCREATE POLICY "business_submissions_service_all" ON "public"."business_submissions"\nFOR ALL TO service_role\nUSING (true)\nWITH CHECK (true);`;
            
          diagnostics.recommendations.push({
            issue: 'No RLS Policies Found',
            solution: 'Create RLS policies appropriate for your connection role',
            sql: policyRecommendation,
            priority: 'HIGH',
            roleContext: `Current role: ${currentRole}`
          });
        }
      }

      if (!diagnostics.tests.selectTest?.success) {
        const selectRole = currentRole === 'service_role' ? 'service_role' : 'public';
        diagnostics.recommendations.push({
          issue: 'Cannot read from business_submissions',
          solution: `Create a SELECT policy for ${selectRole}`,
          sql: `CREATE POLICY "business_submissions_select_${selectRole}" ON "public"."business_submissions" FOR SELECT TO ${selectRole} USING (true);`,
          priority: 'MEDIUM'
        });
      }

      const allTestsPassed = diagnostics.tests.insertTest?.success && diagnostics.tests.selectTest?.success;
      addResult('RLS Diagnostic', allTestsPassed, diagnostics, allTestsPassed ? null : new Error('RLS policy issues detected'));
    } catch (err) {
      addResult('RLS Diagnostic', false, null, err);
    }
  };

  // Test to show current connection role and key type
  const testConnectionRole = async () => {
    try {
      const connectionInfo: any = {
        timestamp: new Date().toISOString(),
        roleDetails: null,
        keyAnalysis: {},
        explanation: null
      };

      // Get role information
      try {
        const { data: roleData, error: roleError } = await supabase.rpc('get_current_role');
        if (!roleError && roleData) {
          connectionInfo.roleDetails = roleData;
        } else {
          // Fallback to simple role
          const { data: simpleRole, error: simpleError } = await supabase.rpc('get_simple_role');
          connectionInfo.roleDetails = simpleError ? { error: 'Could not determine role' } : simpleRole;
        }
      } catch (err) {
        connectionInfo.roleDetails = { error: 'Role detection failed' };
      }

      // Analyze environment keys
      connectionInfo.keyAnalysis = {
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        hasServiceKey: !!import.meta.env.SUPABASE_SERVICE_KEY,
        dataProvider: import.meta.env.VITE_DATA_PROVIDER,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'
      };

      // Determine connection type and provide explanation
      const currentRole = connectionInfo.roleDetails?.current_role || connectionInfo.roleDetails?.current_user;
      
      if (currentRole === 'anon') {
        connectionInfo.explanation = {
          connectionType: 'Anonymous (ANON_KEY)',
          description: 'You are connecting with the anonymous key. This is typical for frontend applications.',
          rlsImplications: 'RLS policies targeting "public" or "anon" roles will apply.',
          typicalUse: 'Frontend users, contact forms, public data access',
          permissions: 'Limited - only what RLS policies explicitly allow for public/anon role'
        };
      } else if (currentRole === 'service_role') {
        connectionInfo.explanation = {
          connectionType: 'Service Role (SERVICE_KEY)',
          description: 'You are connecting with the service role key. This has elevated privileges.',
          rlsImplications: 'RLS policies targeting "service_role" will apply. Can bypass some RLS restrictions.',
          typicalUse: 'Backend operations, admin functions, bulk operations',
          permissions: 'Elevated - can perform most database operations if RLS policies allow'
        };
      } else if (currentRole === 'authenticated') {
        connectionInfo.explanation = {
          connectionType: 'Authenticated User',
          description: 'You are connecting as an authenticated user (logged in).',
          rlsImplications: 'RLS policies targeting "authenticated" role will apply.',
          typicalUse: 'Logged-in users accessing their own data',
          permissions: 'Standard user permissions based on RLS policies'
        };
      } else if (currentRole === 'postgres') {
        const isSuperuser = connectionInfo.roleDetails?.is_superuser === true;
        
        connectionInfo.explanation = {
          connectionType: isSuperuser ? 'PostgreSQL Superuser' : 'PostgreSQL Admin (Supabase Managed)',
          description: isSuperuser 
            ? 'You are connecting with true database superuser privileges.'
            : 'You are connecting as postgres role, but in a Supabase managed environment where superuser privileges are restricted.',
          rlsImplications: isSuperuser 
            ? 'RLS policies are bypassed. Full database access.'
            : 'RLS policies still apply even to postgres role. You need explicit policies.',
          typicalUse: isSuperuser 
            ? 'Database administration, emergency access'
            : 'Supabase admin access, requires proper RLS policies',
          permissions: isSuperuser 
            ? 'Full - can perform any database operation'
            : 'Admin-level but still subject to RLS policies'
        };
      } else {
        connectionInfo.explanation = {
          connectionType: `Unknown Role: ${currentRole}`,
          description: 'The connection role could not be determined or is non-standard.',
          rlsImplications: 'RLS behavior may be unpredictable.',
          typicalUse: 'Unknown',
          permissions: 'Unknown - check role permissions manually'
        };
      }

      addResult('Connection Role Analysis', true, connectionInfo, null);
    } catch (err) {
      addResult('Connection Role Analysis', false, null, err);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setResults([]);
    
    try {
      await testBasicConnection();
      await testJWTDebug();
      await testCurrentRole();
      await testSimpleRole();
      await testMinimalRole();
      await testTablesExist();
      await testRLSPolicies();
      await testRLSDiagnostic();
      await testConnectionRole();
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RLS Testing Dashboard</h2>
        <p className="text-gray-600 mb-6">
          This dashboard helps diagnose Row Level Security (RLS) issues with your Supabase database.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
          >
            {isRunningTests ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </button>
          
          {results.length > 0 && (
            <button
              onClick={copyAllResults}
              disabled={isRunningTests}
              className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                copiedIndex === -1 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
              }`}
            >
              {copiedIndex === -1 ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All Results Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy All Results
                </>
              )}
            </button>
          )}
          
          <button
            onClick={testBasicConnection}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Test Connection
          </button>
          
          <button
            onClick={testJWTDebug}
            disabled={isRunningTests}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
          >
            Test JWT Debug
          </button>
          
          <button
            onClick={testCurrentRole}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Check Role
          </button>
          
          <button
            onClick={testTablesExist}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Check Tables
          </button>
          
          <button
            onClick={testRLSPolicies}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Test RLS Policies
          </button>
          
          <button
            onClick={testRLSDiagnostic}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Full RLS Diagnostic
          </button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-md p-6 ${result.passed ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{result.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.passed ? 'Passed' : 'Failed'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(result, index)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      copiedIndex === index 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                    title="Copy result data to clipboard"
                  >
                    {copiedIndex === index ? (
                      <>
                        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {result.error && (
                <div className="mb-4 p-3 bg-red-50 rounded-md text-sm text-red-700">
                  <div className="font-medium">Error:</div>
                  <div>{result.error.message || JSON.stringify(result.error)}</div>
                </div>
              )}
              
              {/* Special handling for JWT Debug Test */}
              {result.name === 'JWT Debug Test' && result.data && (
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className={`p-3 rounded-md ${result.data.hasAdminRole ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className={`font-medium ${result.data.hasAdminRole ? 'text-green-800' : 'text-red-800'}`}>
                        Admin Status
                      </div>
                      <div className={`text-sm ${result.data.hasAdminRole ? 'text-green-700' : 'text-red-700'}`}>
                        {result.data.hasAdminRole ? '✅ Admin role found' : '❌ No admin role detected'}
                      </div>
                      {result.data.hasAdminRole && (
                        <div className="text-xs text-gray-600 mt-1">
                          Location: {result.data.adminRoleLocation}
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="font-medium text-blue-800">Email</div>
                      <div className="text-sm text-blue-700">{result.data.email}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.data && result.name !== 'JWT Debug Test' && (
                <div className="mt-2">
                  <div className="font-medium text-gray-700 mb-2">Result Data:</div>
                  <div className="bg-gray-50 p-3 rounded-md overflow-auto max-h-96">
                    <pre className="text-xs text-gray-800">{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                </div>
              )}
              
              {result.name === 'RLS Diagnostic' && result.data?.recommendations?.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-gray-700 mb-2">Recommendations:</div>
                  <div className="space-y-3">
                    {result.data.recommendations.map((rec: any, i: number) => (
                      <div key={i} className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <div className="font-medium text-yellow-800">{rec.issue}</div>
                        <div className="text-sm text-yellow-700 mt-1">{rec.solution}</div>
                        {rec.roleContext && (
                          <div className="text-xs text-yellow-600 mt-1 italic">{rec.roleContext}</div>
                        )}
                        <div className="mt-2 bg-gray-800 text-green-400 p-2 rounded text-xs font-mono overflow-auto">
                          {rec.sql}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {results.length === 0 && !isRunningTests && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No test results yet. Click "Run All Tests" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTest;