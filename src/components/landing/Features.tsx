"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scan, Dumbbell, Medal, Flag, Sparkles } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Scan,
        title: "AI Meal Scanner",
        description:
            "Point your camera at any meal. Our Gemini-powered AI instantly analyzes calories, macros, and nutritional content.",
        colorClass: "green",
        span: "span-7",
        height: "height-lg",
        // Added image back
        image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800",
    },
    {
        icon: Dumbbell,
        title: "Smart Workouts",
        description:
            "Track every rep, set, and personal record. Get AI-powered suggestions based on your progress.",
        colorClass: "orange",
        span: "span-5",
        height: "height-lg",
        // Added image back
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    },
    {
        icon: Medal,
        title: "Gamified Progress",
        description:
            "Earn XP, unlock achievements, and climb the leaderboard. Fitness has never been this addictive.",
        colorClass: "purple",
        span: "span-5",
        height: "height-md",
        // Added image back
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    },
    {
        icon: Flag,
        title: "Daily Challenges",
        description:
            "Complete daily and weekly challenges for bonus rewards. Push your limits and break records.",
        colorClass: "blue",
        span: "span-7",
        height: "height-md",
        // Added image back
        image: "https://images.unsplash.com/photo-1517438476312-10d79c6da7b3?w=800",
    },
];

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                // Target the wrapper so both mesh and image move together
                const parallaxElement = card.querySelector(".feature-visual-wrapper");

                // Card entrance animation
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 50%",
                        toggleActions: "play none none reverse",
                    },
                    y: 80,
                    opacity: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power3.out",
                });

                // Parallax effect
                if (parallaxElement) {
                    gsap.to(parallaxElement, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5,
                        },
                        y: -60,
                        ease: "none",
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="features-section">
            {/* Section Header */}
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <div className="section-badge">
                    <Sparkles className="w-4 h-4" style={{ color: "#22c55e" }} />
                    <span>Powerful Features</span>
                </div>
                <h2 className="section-title">
                    Everything You Need
                    <br />
                    <span className="gradient-text">To Dominate</span>
                </h2>
                <p className="section-subtitle">
                    From AI-powered meal analysis to gamified workout tracking, PowerHouse
                    has every tool you need.
                </p>
            </div>

            {/* Feature Grid */}
            <div className="feature-grid">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            ref={(el) => {
                                cardsRef.current[index] = el;
                            }}
                            className={`feature-card ${feature.span} ${feature.height}`}
                        >
                            {/* Icon */}
                            <div className={`feature-icon ${feature.colorClass}`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <div className="feature-content-wrapper">
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>

                            {/* Visual Container (Holds both Mesh and Image) */}
                            <div className="feature-visual-wrapper">

                                {/* 1. The Mesh (Visible by default) */}
                                <div className="feature-visual-mesh">
                                    <div className={`mesh-gradient ${feature.colorClass}`}>
                                        <div className="mesh-orb orb-1"></div>
                                        <div className="mesh-orb orb-2"></div>
                                        <div className="mesh-orb orb-3"></div>
                                    </div>
                                </div>

                                {/* 2. The Image (Visible on Hover) */}
                                <div className="feature-visual-img">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Gradient overlay for text readability */}
                                    <div className="feature-visual-overlay" />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}