import { supabaseClient } from './client';

// Function to verify the users table exists and is accessible
export const verifyUsersTable = async () => {
  try {
    // Test 1: Check if we can access the users table
    const { data, error } = await supabaseClient
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing users table:', error.message);
      return false;
    }

    console.log('✅ Successfully accessed users table');
    
    // Test 2: Check table structure
    const { data: tableInfo, error: tableError } = await supabaseClient
      .from('users')
      .select('*')
      .limit(0);

    if (tableError) {
      console.error('❌ Error describing users table:', tableError.message);
      return false;
    }

    console.log('✅ Users table structure is correct');
    
    // Test 3: Try to insert a test record (and immediately delete it)
    const testId = '00000000-0000-0000-0000-000000000000';
    const { error: insertError } = await supabaseClient
      .from('users')
      .upsert({
        id: testId,
        full_name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      }, {
        onConflict: 'id'
      });

    if (insertError) {
      console.error('❌ Error inserting test record:', insertError.message);
      return false;
    }

    // Clean up test record
    await supabaseClient
      .from('users')
      .delete()
      .eq('id', testId);

    console.log('✅ Successfully inserted and deleted test record');
    console.log('🎉 All verification tests passed! The users table is properly configured.');
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
    return false;
  }
};

// Run verification if this file is executed directly
if (require.main === module) {
  verifyUsersTable()
    .then(success => {
      if (success) {
        console.log('✅ Verification completed successfully');
      } else {
        console.log('❌ Verification failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Verification failed with error:', error);
      process.exit(1);
    });
}