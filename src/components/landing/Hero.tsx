"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Apple, Play } from "lucide-react";
import Image from "next/image";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
    phoneImage?: string; // Optional: path to your phone screenshot
}

export default function Hero({ phoneImage }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial animation timeline
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                    },
                    "-=0.8"
                )
                .from(
                    buttonsRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.6"
                )
                .from(
                    phoneRef.current,
                    {
                        y: 150,
                        opacity: 0,
                        rotateX: -20,
                        duration: 1.4,
                        ease: "power3.out",
                    },
                    "-=1"
                );

            // Glow pulse animation
            gsap.to(glowRef.current, {
                scale: 1.2,
                opacity: 0.8,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Parallax scroll effect for phone
            gsap.to(phoneRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
                y: -100,
                rotateX: 15,
                scale: 0.9,
            });

            // Parallax for glow
            gsap.to(glowRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 2,
                },
                y: -200,
                scale: 0.5,
                opacity: 0,
            });
        }, heroRef);

        // Mouse parallax effect
        const handleMouseMove = (e: MouseEvent) => {
            if (!phoneRef.current) return;
            const x = (e.clientX - window.innerWidth / 2) / 40;
            const y = (e.clientY - window.innerHeight / 2) / 40;
            gsap.to(phoneRef.current, {
                rotateY: x,
                rotateX: -y,
                duration: 1,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            ctx.revert();
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section ref={heroRef} className="hero-section">
            {/* Animated Background Streaks */}
            <AnimatedShaderBackground />

            {/* Background Glow */}
            <div ref={glowRef} className="hero-glow" />

            {/* Hero Content */}
            <div style={{ maxWidth: "900px" }}>
                <h1 ref={titleRef} className="hero-title">
                    Your AI Fitness
                    <br />
                    <span className="gradient-text">Revolution.</span>
                </h1>
                <p ref={subtitleRef} className="hero-subtitle">
                    Scan meals with AI. Track workouts intelligently. Earn rewards and
                    level up your fitness journey with gamification.
                </p>

                {/* App Store Buttons */}
                <div ref={buttonsRef} className="store-buttons">
                    <a href="#" className="store-button">
                        <Apple size={28} />
                        <div className="store-button-text">
                            <span>Download on the</span>
                            <strong>App Store</strong>
                        </div>
                    </a>
                    <a href="#" className="store-button">
                        <Play size={28} fill="black" />
                        <div className="store-button-text">
                            <span>Get it on</span>
                            <strong>Google Play</strong>
                        </div>
                    </a>
                </div>
            </div>

            {/* Phone Mockup */}
            <div className="phone-container">
                <div
                    ref={phoneRef}
                    className="phone-mockup"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Notch */}
                    <div className="phone-notch" />

                    {/* Phone Screen */}
                    <div className="phone-screen">
                        {phoneImage ? (
                            // If you provide an image path, it will display your screenshot
                            <Image
                                src={phoneImage}
                                alt="PowerHouse App Screenshot"
                                fill
                                className="phone-screen-image"
                                priority
                            />
                        ) : (
                            // Placeholder when no image is provided
                            <div className="phone-screen-placeholder">
                                <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📱</div>
                                <div>Add your app screenshot</div>
                                <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#555" }}>
                                    Pass phoneImage prop to Hero component
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}