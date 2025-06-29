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

  const addResult = (name: string, passed: boolean, data: any = null, error: any = null) => {
    setResults(prev => [...prev, { name, passed, data, error }]);
  };

  // Test RLS policies summary
  const testRLSPolicies = async () => {
    try {
      // Test what works and what doesn't
      const results = {
        providersRead: false,
        citiesRead: false,
        contactWrite: false,
        contactRead: false
      };

      // Test providers read
      const { error: providersError } = await supabase
        .from('providers')
        .select('id')
        .limit(1);
      results.providersRead = !providersError;

      // Test cities read  
      const { error: citiesError } = await supabase
        .from('cities')
        .select('id')
        .limit(1);
      results.citiesRead = !citiesError;

      // Test contact submissions read
      const { error: contactReadError } = await supabase
        .from('contact_submissions')
        .select('id')
        .limit(1);
      results.contactRead = !contactReadError;

      // Test contact submissions write
      const { error: contactWriteError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: 'RLS Test',
          business_name: 'RLS Test Business',
          email: 'rlstest@example.com',
          phone: '(555) 123-4567',
          message: 'RLS policy test',
          inquiry_type: 'other',
          status: 'new'
        }])
        .select('id');
      results.contactWrite = !contactWriteError;

      const allPassed = Object.values(results).every(Boolean);
      addResult('RLS Policies Summary', allPassed, results);
    } catch (err) {
      addResult('RLS Policies Summary', false, null, err);
    }
  };

  // Test if tables exist
  const testTablesExist = async () => {
    try {
      const tables = ['providers', 'cities', 'contact_submissions', 'provider_submissions', 'consultation_requests'];
      const results: Record<string, string> = {};
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count(*)', { count: 'exact', head: true });
          results[table] = !error ? 'exists' : `error: ${error.message}`;
        } catch (err: any) {
          results[table] = `error: ${err.message}`;
        }
      }
      
      const allExist = Object.values(results).every(result => result === 'exists');
      addResult('Tables Existence Check', allExist, results, null);
    } catch (err) {
      addResult('Tables Existence Check', false, null, err);
    }
  };

  // Test basic connection (without relying on specific tables)
  const testBasicConnection = async () => {
    try {
      // Test with a simple query that should work even if no tables exist
      const { data, error } = await supabase.rpc('version');
      
      if (error && error.code === '42883') {
        // Function doesn't exist, but connection works
        addResult('Basic Connection', true, { 
          connected: true,
          message: 'Connection successful (function not found is expected)'
        }, null);
      } else if (!error) {
        addResult('Basic Connection', true, { 
          connected: true,
          version: data,
          message: 'Connection and version query successful'
        }, null);
      } else {
        addResult('Basic Connection', false, { 
          connected: false,
          errorCode: error.code,
          errorMessage: error.message
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

  // Comprehensive RLS diagnostic test
  const testRLSDiagnostic = async () => {
    try {
      const diagnostics: any = {
        table: 'contact_submissions',
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
          table_name: 'contact_submissions' 
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
          .eq('tablename', 'contact_submissions');
        
        if (policiesError) {
          // Try alternative approach using RPC if available
          try {
            const { data: altPolicies, error: altError } = await supabase.rpc('get_table_policies', {
              table_name: 'contact_submissions'
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

      // Test 3: Test INSERT operation
      try {
        const testData = {
          name: `RLS Diagnostic Test ${Date.now()}`,
          business_name: `RLS Test Business ${Date.now()}`,
          email: `rlstest${Date.now()}@example.com`,
          phone: '(555) 123-4567',
          message: 'Automated RLS diagnostic test',
          inquiry_type: 'other',
          status: 'new'
        };

        const { data, error } = await supabase
          .from('contact_submissions')
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
              .from('contact_submissions')
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

      // Test 4: Test SELECT operation
      try {
        const { error, count } = await supabase
          .from('contact_submissions')
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
            sql: `CREATE POLICY "contact_insert_${policyTarget}" ON "public"."contact_submissions" FOR INSERT TO ${policyTarget} WITH CHECK (true);`,
            priority: 'HIGH',
            roleContext: currentRole === 'postgres' && !isSuperuser 
              ? `You are connecting as 'postgres' but is_superuser=false. This is typical in Supabase where RLS still applies to the postgres role.`
              : `You are connecting as '${currentRole}' - this determines which RLS policies apply.`
          });
        }
        
        if (!diagnostics.policies || diagnostics.policies.length === 0) {
          const policyRecommendation = currentRole === 'service_role' 
            ? `-- Service role policies (you are using SERVICE_KEY)\nCREATE POLICY "contact_service_all" ON "public"."contact_submissions"\nFOR ALL TO service_role\nUSING (true)\nWITH CHECK (true);`
            : `-- Public and service role policies\nCREATE POLICY "contact_public_insert" ON "public"."contact_submissions"\nFOR INSERT TO public\nWITH CHECK (true);\n\nCREATE POLICY "contact_service_all" ON "public"."contact_submissions"\nFOR ALL TO service_role\nUSING (true)\nWITH CHECK (true);`;
            
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
          issue: 'Cannot read from contact_submissions',
          solution: `Create a SELECT policy for ${selectRole}`,
          sql: `CREATE POLICY "contact_select_${selectRole}" ON "public"."contact_submissions" FOR SELECT TO ${selectRole} USING (true);`,
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
          
          <button
            onClick={testBasicConnection}
            disabled={isRunningTests}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Test Connection
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              
              {result.error && (
                <div className="mb-4 p-3 bg-red-50 rounded-md text-sm text-red-700">
                  <div className="font-medium">Error:</div>
                  <div>{result.error.message || JSON.stringify(result.error)}</div>
                </div>
              )}
              
              {result.data && (
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