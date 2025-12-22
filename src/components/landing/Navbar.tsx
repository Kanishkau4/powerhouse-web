"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                        <Image
                            src="/assets/logo1.png"
                            alt="PowerHouse Logo"
                            width={180}
                            height={180}
                            style={{ objectFit: 'contain' }}
                        />

                        {/* <span className="nav-logo-text">PowerHouse</span> */}
                    </div>

                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href}>
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Changed from "Get Started" to "Login" - Links to Admin */}
                    <Link href="/admin" className="nav-cta">
                        Login
                    </Link>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            display: "none",
                            background: "transparent",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                        }}
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
                    <Link
                        href="/admin"
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
                        Login
                    </Link>
                </div>
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
        </>
    );
}