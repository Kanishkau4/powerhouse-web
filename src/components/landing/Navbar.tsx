"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onChatOpen?: () => void;
}

export default function Navbar({ onChatOpen }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4 Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "App Guide", href: "/guide" },
    { name: "Download", href: "YOUR_APK_LINK_HERE" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="nav-wrapper">
        <nav className={`nav-glass ${isScrolled ? "scrolled" : ""}`}>
          {/* Logo */}
          <Link href="/" className="nav-logo-link">
            <Image
              src="/assets/logo1.png"
              alt="PowerHouse Logo"
              width={180}
              height={45}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {/* Chat Button */}
            {onChatOpen && (
              <button
                className="nav-chat-btn"
                onClick={onChatOpen}
                aria-label="Open Chat"
              >
                <MessageCircle size={18} />
                <span>Chat</span>
              </button>
            )}

            {/* Login Button */}
            <Link href="/admin" className="nav-cta">
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mobile-actions">
              {onChatOpen && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onChatOpen();
                  }}
                  className="mobile-chat-btn"
                >
                  <MessageCircle size={20} />
                  Chat with AI
                </button>
              )}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-login-btn"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-wrapper {
          position: fixed;
          top: 24px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 1000;
          padding: 0 20px;
        }

        .nav-glass {
          width: 100%;
          max-width: 900px;
          background: rgba(10, 10, 10, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 24px;
          border-radius: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .nav-glass.scrolled {
          background: rgba(5, 5, 5, 0.95);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .nav-links-desktop {
          display: flex;
          gap: 28px;
        }

        .nav-links-desktop :global(.nav-link) {
          color: #888888;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-links-desktop :global(.nav-link:hover),
        .nav-links-desktop :global(.nav-link.active) {
          color: #ffffff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-chat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-chat-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
        }

        .nav-cta {
          background: #ffffff;
          color: #000000;
          padding: 8px 20px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        .nav-cta:hover {
          transform: scale(1.05);
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          top: 0;
          background: rgba(5, 5, 5, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          padding: 0 24px;
        }

        .mobile-menu-content :global(.mobile-nav-link) {
          font-size: 1.5rem;
          font-weight: 600;
          color: #888;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .mobile-menu-content :global(.mobile-nav-link:hover),
        .mobile-menu-content :global(.mobile-nav-link.active) {
          color: white;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 300px;
          margin-top: 24px;
        }

        .mobile-chat-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .mobile-menu-content :global(.mobile-login-btn) {
          display: block;
          text-align: center;
          background: #22c55e;
          color: white;
          padding: 16px 40px;
          border-radius: 100px;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .nav-links-desktop {
            display: none;
          }

          .nav-chat-btn span {
            display: none;
          }

          .nav-chat-btn {
            padding: 8px 12px;
          }

          .mobile-menu-btn {
            display: block;
          }

          .nav-cta {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .nav-chat-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}