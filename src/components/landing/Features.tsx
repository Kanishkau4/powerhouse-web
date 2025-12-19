"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Activity, Trophy, Target, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Camera,
        title: "AI Meal Scanner",
        description:
            "Point your camera at any meal. Our Gemini-powered AI instantly analyzes calories, macros, and nutritional content.",
        colorClass: "green",
        span: "span-7",
        height: "height-lg",
        visual: "🍽️",
    },
    {
        icon: Activity,
        title: "Smart Workouts",
        description:
            "Track every rep, set, and personal record. Get AI-powered suggestions based on your progress.",
        colorClass: "orange",
        span: "span-5",
        height: "height-lg",
        visual: "💪",
    },
    {
        icon: Trophy,
        title: "Gamified Progress",
        description:
            "Earn XP, unlock achievements, and climb the leaderboard. Fitness has never been this addictive.",
        colorClass: "purple",
        span: "span-5",
        height: "height-md",
        visual: "🏆",
    },
    {
        icon: Target,
        title: "Daily Challenges",
        description:
            "Complete daily and weekly challenges for bonus rewards. Push your limits and break records.",
        colorClass: "blue",
        span: "span-7",
        height: "height-md",
        visual: "🎯",
    },
];

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                const parallaxElement = card.querySelector(".feature-visual");

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

                // Parallax effect for visual elements
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
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>

                            {/* Parallax Visual */}
                            <div className="feature-visual">{feature.visual}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}