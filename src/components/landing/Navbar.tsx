"use client";

import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "AI Demo", href: "#ai-demo" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Download", href: "#download" },
    ];

    return (
        <>
            <div className="nav-wrapper">
                <nav className={`nav-container ${isScrolled ? "shadow-2xl" : ""}`}>
                    <div className="nav-logo">
                        <div className="nav-logo-icon">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <span className="nav-logo-text">PowerHouse</span>
                    </div>

                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href}>
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <a href="#download" className="nav-cta">
                        Get Started
                    </a>

                    <button
                        className="md:hidden text-white bg-transparent border-none cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        top: "80px",
                        background: "rgba(5, 5, 5, 0.95)",
                        backdropFilter: "blur(16px)",
                        zIndex: 40,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "32px",
                        paddingTop: "64px",
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                color: "white",
                                textDecoration: "none",
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#download"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            background: "#22c55e",
                            color: "white",
                            padding: "16px 32px",
                            borderRadius: "100px",
                            fontWeight: 600,
                            textDecoration: "none",
                            marginTop: "16px",
                        }}
                    >
                        Get Started
                    </a>
                </div>
            )}
        </>
    );
}