"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const galleryImages = [
    { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop", caption: "Main Training Floor" },
    { src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=500&fit=crop", caption: "Weight Training Area" },
    { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop", caption: "Group Fitness Studio" },
    { src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=500&fit=crop", caption: "Cardio Zone" },
    { src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=500&fit=crop", caption: "Personal Training" },
    { src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=500&fit=crop", caption: "Recovery Lounge" },
];

const stackCards = [
    {
        title: "What is PowerHouse?",
        content: "PowerHouse is more than a gym—it's a fitness revolution. We combine state-of-the-art equipment with cutting-edge AI technology to deliver a personalized fitness experience. Our app tracks your meals, workouts, and progress while gamifying your journey to keep you motivated every step of the way.",
    },
    {
        title: "Our Philosophy",
        content: "We believe fitness should be accessible, engaging, and transformative. Every feature we build starts with you—our members. From AI meal scanning to gamified challenges, we're constantly innovating to help you reach your goals faster and have fun doing it.",
    },
    {
        title: "Why PowerHouse?",
        content: "24/7 access, expert trainers, group classes, and an AI-powered app that's like having a personal coach in your pocket. We offer flexible membership plans to fit your lifestyle, plus a supportive community that celebrates every victory with you.",
    },
    {
        title: "Our Community",
        content: "Join thousands of members who push each other to be better every day. Create teams, compete in challenges, climb leaderboards, and earn rewards. At PowerHouse, you're never working out alone—you're part of a family that grows stronger together.",
    },
    {
        title: "Start Your Journey",
        content: "Ready to transform? Download the PowerHouse app, visit our gym, and discover what you're truly capable of. Your strongest self is waiting. Every rep counts, and we're here to count them with you.",
        showCTA: true,
    },
];

export default function AboutPage() {
    const sloganRef = useRef<HTMLHeadingElement>(null);
    const footerCardRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Stacking Cards Scale Effect
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();
                // Basic scale down effect as cards go behind
                if (rect.top <= 100 && rect.bottom > 0) {
                    const progress = Math.abs(rect.top - 100) / 500;
                    const scale = 1 - (progress * 0.05);
                    card.style.transform = `scale(${Math.max(0.9, scale)})`;
                } else {
                    card.style.transform = `scale(1)`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        const sloganObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (sloganRef.current) {
            sloganObserver.observe(sloganRef.current);
        }

        const footerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    } else {
                        entry.target.classList.remove("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (footerCardRef.current) {
            footerObserver.observe(footerCardRef.current);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sloganObserver.disconnect();
            footerObserver.disconnect();
        };
    }, []);

    return (
        <main className="about-page">
            {/* Hero Banner with Auto-Playing Video */}
            <header className="about-header">
                <p className="header-tagline">Transform Your Body, Elevate Your Mind</p>
                <div className="hero-banner">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="hero-video"
                    >
                        <source src="/assets/gym-video.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-overlay" />
                    <h1 className="hero-logo">POWERHOUSE</h1>
                </div>
            </header>

            {/* Stacking Parallax Cards Section */}
            <section className="stack-container">
                <div className="stack-wrapper">
                    {stackCards.map((card, index) => (
                        <div
                            key={index}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`parallax-card card-${index + 1}`}
                        >
                            <h2>{card.title}</h2>
                            <p>{card.content}</p>
                            {card.showCTA && (
                                <Link href="/guide" className="card-cta">
                                    Learn How to Use the App →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Slogan Section with Scaling Animation */}
            <section className="slogan-section">
                <h2 ref={sloganRef} className="scaling-text">
                    Stronger Together. Every Rep Counts.
                </h2>
            </section>

            {/* Life at PowerHouse Gallery */}
            <section className="gallery-section-header">
                <h2 className="section-title">Life at PowerHouse</h2>
            </section>
            <section className="gallery-section">
                <div className="gallery-track">
                    {[...galleryImages, ...galleryImages].map((img, index) => (
                        <div key={index} className="gallery-item">
                            <Image
                                src={img.src}
                                alt={img.caption}
                                width={350}
                                height={450}
                                className="gallery-img"
                            />
                            <p className="gallery-caption">{img.caption}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer with 3D Moving Card */}
            <footer className="about-footer">
                <div ref={footerCardRef} className="footer-card">
                    <div className="footer-logo-container">
                        <Image
                            src="/assets/logo.png"
                            alt="PowerHouse Logo"
                            width={500}
                            height={550}
                            className="footer-logo-img"
                            style={{ objectFit: "contain", width: "100%", height: "auto" }}
                        />
                    </div>
                    <ul className="footer-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/guide">App Guide</Link></li>
                        <li><Link href="/#download">Download</Link></li>
                        <li><Link href="/admin">Login</Link></li>
                    </ul>
                </div>
            </footer>

            <style jsx>{`
        .about-page {
          background-color: #050505;
          color: #ffffff;
          min-height: 100vh;
          line-height: 1.4;
        }

        /* Header Section */
        .about-header {
          padding: 120px 20px 40px;
          text-align: center;
        }

        .header-tagline {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #22c55e;
        }

        .hero-banner {
          width: 100%;
          max-width: 1100px;
          height: 280px;
          margin: 0 auto;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }

        .hero-logo {
          position: relative;
          z-index: 10;
          font-size: clamp(3rem, 12vw, 7rem);
          font-weight: 900;
          color: white;
          letter-spacing: -3px;
          mix-blend-mode: overlay;
        }

        /* Section Title */
        .section-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }

        .gallery-section-header {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 20px 0;
        }

        /* Stacking Parallax Cards */
        .stack-container {
          padding: 100px 0;
          background: transparent;
        }

        .stack-wrapper {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        .parallax-card {
          position: sticky;
          top: 100px;
          width: 100%;
          min-height: 450px;
          border-radius: 40px;
          padding: 50px;
          margin-bottom: 150px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
          will-change: transform;
          transform-origin: top center;
        }

        .parallax-card h2 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 25px;
          font-weight: 800;
        }

        .parallax-card p {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 90%;
        }

        /* Card Colors */
        .card-1 { background-color: #1a1a1a; color: #fff; z-index: 1; }
        .card-2 { background-color: #252525; color: #fff; z-index: 2; }
        .card-3 { background-color: #16a34a; color: #fff; z-index: 3; }
        .card-4 { background-color: #22c55e; color: #050505; z-index: 4; }
        .card-5 { background-color: #ffffff; color: #050505; z-index: 5; }

        .card-cta {
          display: inline-block;
          margin-top: 24px;
          color: #22c55e;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        .card-cta:hover {
          color: #16a34a;
        }

        /* Slogan Section */
        .slogan-section {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
          overflow: hidden;
        }

        .scaling-text {
          font-size: clamp(2rem, 8vw, 5rem);
          font-weight: 900;
          max-width: 900px;
          line-height: 1;
          transform: scale(0.5);
          opacity: 0;
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      opacity 1s ease;
        }

        .scaling-text.visible {
          transform: scale(1);
          opacity: 1;
        }

        /* Gallery Section */
        .gallery-section {
          padding: 40px 0 100px;
          overflow: hidden;
        }

        .gallery-track {
          display: flex;
          gap: 20px;
          width: fit-content;
          animation: scroll-gallery 40s linear infinite;
        }

        .gallery-item {
          width: 350px;
          flex-shrink: 0;
        }

        .gallery-item :global(.gallery-img) {
          width: 100%;
          height: 450px;
          object-fit: cover;
          border-radius: 20px;
          margin-bottom: 15px;
        }

        .gallery-caption {
          font-weight: 600;
          font-size: 0.9rem;
          color: #888;
          padding-left: 8px;
        }

        @keyframes scroll-gallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Footer Section */
        .about-footer {
          padding: 100px 20px;
          background: #0a0a0a;
          perspective: 1000px;
        }

        .footer-card {
          max-width: 1000px;
          margin: 0 auto;
          background: #fff;
          color: #000;
          padding: 100px 50px;
          border-radius: 30px;
          text-align: center;
          transform: translateZ(-200px) rotateX(10deg);
          opacity: 0.5;
          transition: all 1s ease-out;
        }

        .footer-card.active {
          transform: translateZ(0) rotateX(0deg);
          opacity: 1;
        }

        .footer-logo-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .footer-logo-img {
          max-width: 100%;
          height: auto;
        }

        .footer-links {
          margin-top: 50px;
          display: flex;
          justify-content: center;
          gap: 30px;
          list-style: none;
          flex-wrap: wrap;
        }

        .footer-links :global(a) {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .footer-links :global(a:hover) {
          color: #22c55e;
        }

        @media (max-width: 768px) {
          .parallax-card {
            padding: 30px;
            min-height: 400px;
          }

          .scaling-text {
            font-size: clamp(1.5rem, 6vw, 2.5rem);
          }

          .footer-card {
            padding: 60px 30px;
          }

          .footer-logo-container {
            max-width: 300px;
          }

          .footer-links {
            gap: 20px;
          }
        }
      `}</style>
        </main>
    );
}