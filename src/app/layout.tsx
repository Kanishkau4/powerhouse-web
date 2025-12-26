import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://powerhouselk.netlify.app'), // Replace with your actual domain
  title: {
    default: "PowerHouse | AI-Powered Fitness Revolution",
    template: "%s | PowerHouse Fitness"
  },
  description: "Transform your fitness journey with AI meal scanning, smart workout tracking, and gamified challenges. Your personal AI fitness companion.",
  keywords: ["fitness app", "AI meal scanner", "workout tracker", "calorie counter", "fitness gamification", "health tech"],
  authors: [{ name: "PowerHouse Team" }],
  creator: "PowerHouse",
  publisher: "PowerHouse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PowerHouse | AI-Powered Fitness Revolution",
    description: "Transform your fitness journey with AI meal scanning and gamified workouts",
    url: 'https://powerhouselk.netlify.app',
    siteName: 'PowerHouse Fitness',
    images: [
      {
        url: '/assets/app-screenshot.png', // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: 'PowerHouse App Preview',
      },
      {
        url: '/assets/logo.png', // Fallback or logo
        width: 800,
        height: 800,
        alt: 'PowerHouse Logo',
      }
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerHouse | AI-Powered Fitness Revolution',
    description: 'Transform your fitness journey with AI meal scanning and gamified workouts',
    images: ['/assets/app-screenshot.png'],
    creator: '@powerhouse_fit', // Example handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/assets/logo.png', // Using logo as apple touch icon backup
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'PowerHouse Fitness',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'iOS, Android, Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Transform your fitness journey with AI meal scanning, smart workout tracking, and gamified challenges.',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1000',
              },
            })
          }}
        />
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}