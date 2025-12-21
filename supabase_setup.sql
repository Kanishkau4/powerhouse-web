-- ============================================================================
-- POWERHOUSE SETUP SCRIPT
-- Include: RLS Policies for Public Access (Dev Mode) & Seed Data
-- Run this in your Supabase SQL Editor to populate your dashboard.
-- ============================================================================

-- 1. ENABLE READ ACCESS (Fixes "I can't see available data")
-- We allow SELECT for 'anon' and 'authenticated' roles for demonstration.
-- WARNING: For production, tighten these policies.

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Users" ON public.users;
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public Delete Users" ON public.users;
CREATE POLICY "Public Delete Users" ON public.users FOR DELETE USING (true);

-- Workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Workouts" ON public.workouts;
CREATE POLICY "Public Read Workouts" ON public.workouts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Manage Workouts" ON public.workouts;
CREATE POLICY "Public Manage Workouts" ON public.workouts FOR ALL USING (true);

-- Foods
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Foods" ON public.foods;
CREATE POLICY "Public Read Foods" ON public.foods FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Manage Foods" ON public.foods;
CREATE POLICY "Public Manage Foods" ON public.foods FOR ALL USING (true);

-- Challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Challenges" ON public.challenges;
CREATE POLICY "Public Read Challenges" ON public.challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Manage Challenges" ON public.challenges;
CREATE POLICY "Public Manage Challenges" ON public.challenges FOR ALL USING (true);

-- Badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Badges" ON public.badges;
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Manage Badges" ON public.badges;
CREATE POLICY "Public Manage Badges" ON public.badges FOR ALL USING (true);


-- 2. SEED DATA (Populates the Dashboard)

-- Insert Users
INSERT INTO public.users (username, email, fitness_goal, activity_level, xp_points, level, gender, age, height, current_weight, created_at)
VALUES
('john_doe', 'john@example.com', 'Build Muscle', 'Active', 1250, 3, 'Male', 28, 180, 85, NOW() - INTERVAL '2 days'),
('jane_smith', 'jane@example.com', 'Lose Weight', 'Moderate', 3400, 5, 'Female', 32, 165, 68, NOW() - INTERVAL '5 days'),
('mike_fit', 'mike@example.com', 'Stay Fit', 'Very Active', 5600, 8, 'Male', 25, 175, 75, NOW() - INTERVAL '10 days'),
('sarah_zen', 'sarah@example.com', 'Flexibility', 'Light', 800, 2, 'Female', 29, 170, 60, NOW() - INTERVAL '1 day'),
('alex_power', 'alex@example.com', 'Gain Weight', 'Active', 2100, 4, 'Other', 30, 178, 80, NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Insert Workouts
INSERT INTO public.workouts (workout_name, description, difficulty, category, estimated_duration, estimated_calories_burned, created_at)
VALUES
('Morning HIIT Blast', 'High intensity interval training to start the day.', 'Intermediate', 'HIIT', 30, 350, NOW() - INTERVAL '1 day'),
('Full Body Strength', 'Comprehensive strength training using dumbbells.', 'Advanced', 'Strength', 60, 500, NOW() - INTERVAL '3 days'),
('Yoga for Beginners', 'Relaxing flow to improve flexibility.', 'Beginner', 'Yoga', 45, 150, NOW() - INTERVAL '2 days'),
('Core Crusher', 'Focused abdominal exercises.', 'Intermediate', 'Core', 20, 200, NOW() - INTERVAL '4 days'),
('Cardio Kickboxing', 'Fun and energetic cardio workout.', 'Intermediate', 'Cardio', 40, 400, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Insert Foods
INSERT INTO public.foods (food_name, serving_size_description, calories, protein, carbs, fat, is_sri_lankan, created_at)
VALUES
('Rice and Curry (Chicken)', '1 plate', 650, 35, 80, 20, true, NOW()),
('Pol Sambol', '1 tbsp', 80, 1, 5, 6, true, NOW()),
('Oatmeal with Berries', '1 bowl', 300, 10, 50, 6, false, NOW()),
('Grilled Salmon', '150g', 350, 30, 0, 25, false, NOW()),
('String Hoppers (10)', '10 hoppers', 200, 4, 45, 1, true, NOW())
ON CONFLICT DO NOTHING;

-- Insert Challenges
INSERT INTO public.challenges (challenge_name, description, target_value, unit, duration_days, xp_reward, challenge_type, created_at)
VALUES
('10k Steps Daily', 'Walk 10,000 steps every day for a week.', 10000, 'steps', 7, 500, 'physical', NOW()),
('Sugar Free Week', 'Avoid added sugars for 7 days.', 7, 'days', 7, 1000, 'nutrition', NOW()),
('Marathon Month', 'Run a total of 42km this month.', 42, 'km', 30, 2000, 'physical', NOW()),
('Mindful Meditation', 'Meditate for 10 minutes daily.', 10, 'mins', 14, 300, 'mental', NOW())
ON CONFLICT DO NOTHING;

-- Insert Badges
INSERT INTO public.badges (badge_name, description, requirement_description, created_at)
VALUES
('Early Bird', 'Completed a workout before 7 AM.', 'Workout between 4AM and 7AM', NOW()),
('Step Master', 'Hit 10,000 steps for 30 days.', '10k steps streak', NOW()),
('Protein Power', 'Hit protein goals for a week.', 'Log daily protein target', NOW()),
('Challenge Champion', 'Won 5 challenges.', 'Complete 5 challenges', NOW())
ON CONFLICT DO NOTHING;
