import { supabase } from './supabase'

export interface AdminUser {
    id: string
    email: string
    username: string
    role: 'admin' | 'viewer'
}

// Test user credentials (hardcoded for demo purposes)
const TEST_USER = {
    username: 'admin',
    password: '1234',
    email: 'test@powerhouse.local',
    role: 'viewer' as const
}

/**
 * Sign in admin user with email/username and password
 */
export async function signInAdmin(emailOrUsername: string, password: string) {
    // Check if it's the test user (viewer role)
    if (emailOrUsername === TEST_USER.username && password === TEST_USER.password) {
        // Store test user session
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('admin_authenticated', 'true')
            sessionStorage.setItem('admin_email', TEST_USER.email)
            sessionStorage.setItem('admin_username', TEST_USER.username)
            sessionStorage.setItem('admin_role', TEST_USER.role)
        }

        return {
            user: {
                id: 'test-user-id',
                email: TEST_USER.email,
                username: TEST_USER.username,
                role: TEST_USER.role
            }
        }
    }

    // Otherwise, authenticate with Supabase (admin role)
    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
    })

    if (error) {
        throw error
    }

    // Check if user has admin role
    if (data.user) {
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id, email, username')
            .eq('email', emailOrUsername)
            .single()

        if (userError || !userData) {
            await supabase.auth.signOut()
            throw new Error('User not found in database')
        }

        // Store admin session
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('admin_authenticated', 'true')
            sessionStorage.setItem('admin_email', emailOrUsername)
            sessionStorage.setItem('admin_username', userData.username || 'Admin')
            sessionStorage.setItem('admin_role', 'admin')
            sessionStorage.setItem('admin_user_id', userData.user_id)
        }
    }

    return data
}

/**
 * Sign out admin user
 */
export async function signOutAdmin() {
    // Check if it's test user
    const role = typeof window !== 'undefined' ? sessionStorage.getItem('admin_role') : null

    if (role !== 'viewer') {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    }

    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_authenticated')
        sessionStorage.removeItem('admin_email')
        sessionStorage.removeItem('admin_username')
        sessionStorage.removeItem('admin_role')
        sessionStorage.removeItem('admin_user_id')
    }
}

/**
 * Check if user is authenticated as admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
    // Check session storage first
    if (typeof window !== 'undefined') {
        const isAuth = sessionStorage.getItem('admin_authenticated')
        if (!isAuth) return false

        // If it's the test user, they're authenticated
        const role = sessionStorage.getItem('admin_role')
        if (role === 'viewer') return true
    }

    // Verify with Supabase for real admin users
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
}

/**
 * Get current admin user
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
    if (typeof window !== 'undefined') {
        const role = sessionStorage.getItem('admin_role')
        const email = sessionStorage.getItem('admin_email')
        const username = sessionStorage.getItem('admin_username')

        // Return test user if it's a viewer
        if (role === 'viewer' && email) {
            return {
                id: 'test-user-id',
                email: email,
                username: username || 'Test Admin',
                role: 'viewer'
            }
        }
    }

    // Get real admin user from Supabase
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return null

    const username = typeof window !== 'undefined'
        ? sessionStorage.getItem('admin_username') || 'Admin'
        : 'Admin'

    return {
        id: session.user.id,
        email: session.user.email || '',
        username: username,
        role: 'admin'
    }
}

/**
 * Check if current user has admin role (can edit/delete)
 */
export function isAdminRole(): boolean {
    if (typeof window === 'undefined') return false
    const role = sessionStorage.getItem('admin_role')
    return role === 'admin'
}

/**
 * Check if current user is viewer role (read-only)
 */
export function isViewerRole(): boolean {
    if (typeof window === 'undefined') return false
    const role = sessionStorage.getItem('admin_role')
    return role === 'viewer'
}

/**
 * Update admin profile
 */
export async function updateAdminProfile(updates: {
    username?: string
    email?: string
    password?: string
}) {
    const currentAdmin = await getCurrentAdmin()
    if (!currentAdmin || currentAdmin.role !== 'admin') {
        throw new Error('Only admins can update their profile')
    }

    const userId = typeof window !== 'undefined'
        ? sessionStorage.getItem('admin_user_id')
        : null

    if (!userId) {
        throw new Error('User ID not found')
    }

    // Update in users table
    if (updates.username || updates.email) {
        const updateData: Record<string, string> = {}
        if (updates.username) updateData.username = updates.username
        if (updates.email) updateData.email = updates.email

        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('user_id', userId)

        if (error) throw error

        // Update session storage
        if (typeof window !== 'undefined') {
            if (updates.username) sessionStorage.setItem('admin_username', updates.username)
            if (updates.email) sessionStorage.setItem('admin_email', updates.email)
        }
    }

    // Update password in auth
    if (updates.password) {
        const { error } = await supabase.auth.updateUser({
            password: updates.password
        })

        if (error) throw error
    }
}
