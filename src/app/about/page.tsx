import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About PowerHouse | The Future of Fitness',
  description: 'PowerHouse combines state-of-the-art gym facilities with AI technology to deliver a personalized fitness experience.',
  openGraph: {
    title: 'About PowerHouse | The Future of Fitness',
    description: 'PowerHouse combines state-of-the-art gym facilities with AI technology to deliver a personalized fitness experience.',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}