import type { Metadata } from 'next';
import GuideContent from '@/components/guide/GuideContent';

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'See how PowerHouse uses AI to scan your meals, track your workouts, and gamify your fitness journey.',
    openGraph: {
        title: 'How PowerHouse Works | AI Fitness Guide',
        description: 'See how PowerHouse uses AI to scan your meals, track your workouts, and gamify your fitness journey.',
    },
};

export default function GuidePage() {
    return <GuideContent />;
}