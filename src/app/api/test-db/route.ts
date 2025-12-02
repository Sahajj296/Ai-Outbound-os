import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase, LEADS_TABLE } from '@/lib/supabase';
import { getLeads, addLeads, clearLeads } from '@/lib/db';
import { ProcessedLead } from '@/utils/types';

export async function GET() {
  const results: {
    supabaseConfigured: boolean;
    connectionTest: string;
    canRead: boolean;
    canWrite: boolean;
    tableExists: boolean;
    currentLeadCount: number;
    testWrite: string;
    errors?: string[];
  } = {
    supabaseConfigured: false,
    connectionTest: 'not_configured',
    canRead: false,
    canWrite: false,
    tableExists: false,
    currentLeadCount: 0,
    testWrite: 'not_tested',
    errors: [],
  };

  try {
    // Check if Supabase is configured
    results.supabaseConfigured = isSupabaseConfigured();

    if (!results.supabaseConfigured) {
      return NextResponse.json({
        ...results,
        message: 'Supabase not configured. Check environment variables.',
        fallback: 'Using file-based storage (local only)',
      });
    }

    if (!supabase) {
      return NextResponse.json({
        ...results,
        message: 'Supabase client not initialized',
      });
    }

    // Test 1: Check if table exists
    try {
      const { data, error } = await supabase
        .from(LEADS_TABLE)
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          // Table does not exist
          results.errors?.push('Table "leads" does not exist. Run supabase-setup.sql');
        } else {
          results.errors?.push(`Table check error: ${error.message}`);
        }
      } else {
        results.tableExists = true;
        results.connectionTest = 'success';
      }
    } catch (error) {
      results.errors?.push(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: Read test
    try {
      const leads = await getLeads();
      results.canRead = true;
      results.currentLeadCount = leads.length;
    } catch (error) {
      results.errors?.push(`Read test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Write test (create a test lead, then delete it)
    try {
      const testLead: ProcessedLead = {
        id: `test-${Date.now()}`,
        name: 'Test Lead',
        company: 'Test Company',
        email: 'test@example.com',
        score: 75,
        status: 'warm',
        industry: 'Testing',
        notes: 'This is a test lead for database verification',
      };

      // Add test lead
      await addLeads([testLead]);

      // Verify it was added
      const leadsAfterAdd = await getLeads();
      const testLeadFound = leadsAfterAdd.find(l => l.id === testLead.id);

      if (testLeadFound) {
        results.canWrite = true;
        results.testWrite = 'success';

        // Clean up: Remove test lead
        try {
          const { error: deleteError } = await supabase
            .from(LEADS_TABLE)
            .delete()
            .eq('id', testLead.id);

          if (deleteError) {
            results.errors?.push(`Cleanup failed: ${deleteError.message}`);
          }
        } catch (cleanupError) {
          results.errors?.push(`Cleanup error: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown'}`);
        }
      } else {
        results.testWrite = 'failed';
        results.errors?.push('Test lead was not found after insertion');
      }
    } catch (error) {
      results.testWrite = 'failed';
      results.errors?.push(`Write test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Determine overall status
    const allTestsPassed = 
      results.supabaseConfigured &&
      results.tableExists &&
      results.canRead &&
      results.canWrite &&
      results.testWrite === 'success';

    return NextResponse.json({
      ...results,
      overallStatus: allTestsPassed ? 'success' : 'partial',
      message: allTestsPassed
        ? '✅ All database tests passed! Database is working correctly.'
        : '⚠️ Some tests failed. Check errors array for details.',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json({
      ...results,
      overallStatus: 'error',
      message: 'Database test encountered an error',
      errors: [
        ...(results.errors || []),
        error instanceof Error ? error.message : 'Unknown error',
      ],
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

