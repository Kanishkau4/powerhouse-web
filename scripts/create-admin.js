/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Admin User Setup Script
 * 
 * This script helps you create an admin user for the PowerHouse admin panel.
 * Run this script once to set up your first admin user.
 * 
 * Usage:
 * 1. Update the email and password below
 * 2. Run: node scripts/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
// Load .env first, then .env.local (will overwrite)
require('dotenv').config();
require('dotenv').config({ path: '.env' });

// Configuration - Uses env variables or defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    console.log('🚀 Creating admin user...\n');

    try {
        // Step 1: Create auth user
        console.log('📝 Step 1: Setting up authentication user...');

        // Check if we have service role key which is needed for admin actions
        const isServiceKey = supabaseServiceKey.includes('service_role') || !supabaseServiceKey.startsWith('eyJh');

        let userId = null;

        if (isServiceKey) {
            // Use Admin API to create user with confirmed email
            const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                email_confirm: true,
                user_metadata: { username: ADMIN_USERNAME }
            });

            if (adminError) {
                if (adminError.message.includes('already registered')) {
                    console.log('⚠️  User already exists, ensuring email is confirmed...');
                    // Get user ID to update
                    const { data: users } = await supabase.auth.admin.listUsers();
                    const existingAuthUser = users?.users.find(u => u.email === ADMIN_EMAIL);

                    if (existingAuthUser) {
                        userId = existingAuthUser.id;
                        await supabase.auth.admin.updateUserById(userId, {
                            email_confirm: true,
                            password: ADMIN_PASSWORD // Update password too just in case
                        });
                        console.log('✅ Existing user confirmed and password updated');
                    }
                } else {
                    throw adminError;
                }
            } else {
                userId = adminData.user?.id;
                console.log('✅ Admin user created and confirmed via Admin API');
            }
        } else {
            // Fallback to regular signUp
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                options: {
                    data: {
                        username: ADMIN_USERNAME,
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    console.log('⚠️  User already exists in authentication system');
                } else {
                    throw authError;
                }
            } else {
                userId = authData.user?.id;
                console.log('✅ Authentication user created successfully');
                console.log('⚠️  NOTE: Email confirmation may be required depending on your Supabase settings.');
            }
        }

        if (userId) {
            console.log(`   User ID: ${userId}\n`);
        }

        // Step 2: Check if user exists in users table
        console.log('📝 Step 2: Checking users table...');
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('user_id, email')
            .eq('email', ADMIN_EMAIL)
            .single();

        if (existingUser) {
            console.log('✅ User already exists in users table');
            console.log(`   User ID: ${existingUser.user_id}\n`);
        } else if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        } else {
            // Create user in users table
            console.log('📝 Creating user in users table...');
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        email: ADMIN_EMAIL,
                        username: ADMIN_USERNAME,
                        xp_points: 0,
                        level: 1,
                    }
                ])
                .select()
                .single();

            if (userError) {
                throw userError;
            }

            console.log('✅ User created in users table');
            console.log(`   User ID: ${userData.user_id}\n`);
        }

        // Success message
        console.log('🎉 Admin user setup complete!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    ', ADMIN_EMAIL);
        console.log('🔑 Password: ', ADMIN_PASSWORD === 'Admin@123456' ? ADMIN_PASSWORD : '******** (Hidden for security)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🌐 Login URL: http://localhost:3000/admin/login\n');
        console.log('⚠️  IMPORTANT: Change the password after first login!');
        console.log('⚠️  Keep these credentials secure!\n');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check your Supabase credentials in .env.local');
        console.error('2. Ensure the users table exists in your database');
        console.error('3. Check Supabase dashboard for more details\n');
        process.exit(1);
    }
}

// Run the script
createAdminUser();
