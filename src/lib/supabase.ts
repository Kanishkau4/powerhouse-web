import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
    user_id: string
    username: string
    email: string
    profile_picture_url?: string
    height?: number
    current_weight?: number
    fitness_goal?: string
    activity_level?: string
    xp_points: number
    level: number
    gender?: string
    age?: number
    created_at: string
    updated_at: string
}

export interface Exercise {
    exercise_id: string
    exercise_name: string
    description?: string
    video_url?: string
    animation_url?: string
    muscle_group_targeted?: string
    created_at: string
}

export interface Workout {
    workout_id: string
    workout_name: string
    description?: string
    difficulty?: string
    category?: string
    estimated_duration?: number
    estimated_calories_burned?: number
    image_url?: string
    created_at: string
}

export interface Food {
    food_id: string
    food_name: string
    serving_size_description?: string
    calories: number
    protein: number
    carbs: number
    fat: number
    is_sri_lankan: boolean
    image_url?: string
    created_at: string
    user_id?: string
}

export interface Challenge {
    challenge_id: string
    challenge_name: string
    description?: string
    target_value?: number
    unit?: string
    duration_days?: number
    xp_reward: number
    image_url?: string
    challenge_type: string
    meta_data?: Record<string, unknown>
    start_date?: string
    end_date?: string
    created_at: string
}

export interface Badge {
    badge_id: string
    badge_name: string
    description?: string
    icon_url?: string
    requirement_description?: string
    created_at: string
}

export interface Tip {
    tip_id: string
    title: string
    category: string
    content: string
    summary?: string
    image_url?: string
    video_url?: string
    difficulty_level?: string
    reading_time: number
    is_featured: boolean
    view_count: number
    like_count: number
    created_at: string
    updated_at: string
}

export interface TipCategory {
    category_id: string
    name: string
    display_name: string
    icon_name?: string
    color_hex?: string
    description?: string
    sort_order: number
    created_at: string
}

export interface Recipe {
    recipe_id: string
    recipe_name: string
    description?: string
    prep_time: number
    cook_time: number
    difficulty: 'Easy' | 'Medium' | 'Hard'
    servings: number
    calories_per_serving: number
    protein_per_serving: number
    carbs_per_serving: number
    fat_per_serving: number
    ingredients: string[]
    instructions: string[]
    image_url?: string
    video_url?: string
    is_sri_lankan: boolean
    cuisine?: string
    created_at: string
    updated_at: string
}

export interface Team {
    team_id: string
    team_name: string
    description?: string
    image_url?: string
    created_by: string
    member_count: number
    total_xp: number
    created_at: string
}