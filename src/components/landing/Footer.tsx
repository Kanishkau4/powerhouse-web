"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Dumbbell, Twitter, Instagram, Youtube } from "lucide-react";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const logoTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the large logo text
            gsap.from(logoTextRef.current, {
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 2,
                },
                x: -300,
                opacity: 0,
                letterSpacing: "0.3em",
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer id="download" ref={footerRef} className="footer-section">
            <AnimatedShaderBackground />
            <div className="footer-content">
                {/* CTA */}
                <div className="footer-badge">
                    <Dumbbell className="w-4 h-4" style={{ color: "#22c55e" }} />
                    <span>Start Your Journey Today</span>
                </div>

                <h2 className="footer-title">
                    Download <span className="gradient-text">PowerHouse</span>
                </h2>

                <p className="footer-subtitle">
                    Join over 500,000 users who are transforming their fitness journey
                    with AI-powered tracking and gamification.
                </p>

                {/* App Store Buttons */}
                <div className="footer-buttons">
                    <a href="https://github.com/Kanishkau4/PowerHouse/releases/download/V1.0.0/app-release.apk" className="footer-store-button liquid-button">
                        <Zap size={28} fill="currentColor" />
                        <div className="store-button-text">
                            <span>Get the App</span>
                            <strong>Download APK</strong>
                        </div>
                        <div className="liquid"></div>
                    </a>
                </div>

                {/* Links */}
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Support</a>
                    <a href="#">Contact</a>
                </div>

                {/* Social Links */}
                <div className="footer-social">
                    <a href="#" className="social-link">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="social-link">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="social-link">
                        <Youtube size={20} />
                    </a>
                </div>
            </div>

            {/* Large Animated Logo Text */}
            <div ref={logoTextRef} className="footer-large-text">
                POWERHOUSE
            </div>

            {/* Copyright */}
            <p className="footer-copyright">© 2025 POWERHOUSE. ALL RIGHTS RESERVED.</p>
        </footer>
    );
}