"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionStyle } from "framer-motion";
import { Apple, Play, Activity, Utensils, Zap, Trophy } from "lucide-react";
import Image from "next/image";

interface HeroProps {
    phoneImage?: string;
}

export default function Hero({ phoneImage }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth scroll progress for fluidity
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Phone Animation Transforms
    // Starts lower and moves up past the text
    const phoneY = useTransform(smoothProgress, [0, 1], ["50%", "-60%"]);
    // Reduced final scale from 1.4 to 1.25
    const phoneScale = useTransform(smoothProgress, [0, 0.6], [1.0, 1.25]);
    const phoneRotateX = useTransform(smoothProgress, [0, 0.6], [0, 10]);

    // Text Animation Transforms (Heading moves slightly and fades)
    const textY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
    const textOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0.15]);

    // Transaction Card Animation Transforms (Shifted targets upward)
    // Left side cards
    const card1X = useTransform(smoothProgress, [0.2, 0.8], [0, -420]);
    const card1Y = useTransform(smoothProgress, [0.2, 0.8], [0, -240]); // Shifting up
    const card1Opacity = useTransform(smoothProgress, [0.25, 0.45], [0, 1]);

    const card3X = useTransform(smoothProgress, [0.2, 0.8], [0, -380]);
    const card3Y = useTransform(smoothProgress, [0.2, 0.8], [0, 100]); // Shifting up
    const card3Opacity = useTransform(smoothProgress, [0.25, 0.45], [0, 1]);

    // Right side cards
    const card2X = useTransform(smoothProgress, [0.2, 0.8], [0, 420]);
    const card2Y = useTransform(smoothProgress, [0.2, 0.8], [0, -180]); // Shifting up
    const card2Opacity = useTransform(smoothProgress, [0.25, 0.45], [0, 1]);

    const card4X = useTransform(smoothProgress, [0.2, 0.8], [0, 380]);
    const card4Y = useTransform(smoothProgress, [0.2, 0.8], [0, 140]); // Shifting up
    const card4Opacity = useTransform(smoothProgress, [0.25, 0.45], [0, 1]);

    return (
        <section ref={containerRef} className="hero-section-new">
            <div className="sticky-content">
                {/* Background Text (Phone moves over this) */}
                <motion.div
                    className="hero-text-container"
                    style={{ y: textY, opacity: textOpacity, pointerEvents: 'auto' }}
                >
                    <h1 className="hero-title">
                        Your AI Fitness
                        <br />
                        <span className="gradient-text">Revolution.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Scan meals with AI. Track workouts intelligently. Earn rewards and
                        level up your fitness journey with gamification.
                    </p>

                    <div className="store-buttons">
                        <a href="YOUR_APK_LINK_HERE" className="store-button liquid-button">
                            <Zap size={28} fill="currentColor" />
                            <div className="store-button-text">
                                <span>Get the App</span>
                                <strong>Download APK</strong>
                            </div>
                            <div className="liquid"></div>
                        </a>
                    </div>
                </motion.div>

                {/* Main Visual Scene */}
                <div className="phone-scene">
                    {/* Transaction Cards (Positioned behind the phone initially) */}
                    <TransactionCard
                        style={{ x: card1X, y: card1Y, opacity: card1Opacity }}
                        icon={<Utensils size={22} />}
                        label="Meal Scanned"
                        value="+420 kcal"
                        type="orange"
                    />
                    <TransactionCard
                        style={{ x: card2X, y: card2Y, opacity: card2Opacity }}
                        icon={<Activity size={22} />}
                        label="Morning Run"
                        value="5.2 km"
                        type="green"
                    />
                    <TransactionCard
                        style={{ x: card3X, y: card3Y, opacity: card3Opacity }}
                        icon={<Zap size={22} />}
                        label="Energy Boost"
                        value="+15% XP"
                        type="purple"
                    />
                    <TransactionCard
                        style={{ x: card4X, y: card4Y, opacity: card4Opacity }}
                        icon={<Trophy size={22} />}
                        label="Daily Goal"
                        value="Completed"
                        type="blue"
                    />

                    {/* The Phone Mockup */}
                    <motion.div
                        className="phone-mockup-new"
                        style={{
                            y: phoneY,
                            scale: phoneScale,
                            rotateX: phoneRotateX,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        {/* Notch */}
                        <div className="phone-notch" />

                        {/* Phone Screen */}
                        <div className="phone-screen">
                            {phoneImage ? (
                                <Image
                                    src={phoneImage}
                                    alt="PowerHouse App Screenshot"
                                    fill
                                    className="phone-screen-image"
                                    priority
                                />
                            ) : (
                                <div className="phone-screen-placeholder">
                                    <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📱</div>
                                    <div>Add your app screenshot</div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

interface TransactionCardProps {
    style: MotionStyle;
    icon: React.ReactNode;
    label: string;
    value: string;
    type: 'orange' | 'green' | 'purple' | 'blue';
}

function TransactionCard({ style, icon, label, value, type }: TransactionCardProps) {
    return (
        <motion.div className="hero-transaction-card" style={style}>
            <div className={`card-icon-wrapper ${type}`}>
                {icon}
            </div>
            <div className="card-info">
                <p className="card-label">{label}</p>
                <p className="card-value">{value}</p>
            </div>
        </motion.div>
    );
}