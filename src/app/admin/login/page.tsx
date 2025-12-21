"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { signInAdmin, isAdminAuthenticated } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const isAuth = await isAdminAuthenticated();
        if (isAuth) {
            router.push("/admin");
        }
        setChecking(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInAdmin(email, password);
            toast.success("Welcome back, Admin!");
            router.push("/admin");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100%",
                background: "radial-gradient(circle at top right, #1e293b, #0f172a)"
            }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(34, 197, 94, 0.3)",
                    borderTop: "4px solid #22c55e",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at top right, #1e293b, #0f172a)"
        }}>
            {/* Login Container */}
            <div style={{
                display: "flex",
                width: "900px",
                maxWidth: "95%",
                height: "600px",
                background: "white",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}>
                {/* Sidebar */}
                <div style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #22c55e, #4ade80)",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "white",
                    position: "relative"
                }}>
                    {/* Logo Section */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textDecoration: "none" }}>
                        <Image src="/assets/logo.png" alt="Logo" width={180} height={180} />
                        {/* <Zap size={20} /> */}
                        {/* <strong style={{ fontSize: "1.4rem" }}>FitPulse</strong> */}
                    </Link>

                    {/* Tagline */}
                    <div>
                        <h2 style={{
                            fontSize: "2.2rem",
                            lineHeight: 1.2,
                            fontWeight: 700,
                            marginBottom: "12px"
                        }}>
                            Transform your fitness business.
                        </h2>
                        <p style={{
                            opacity: 0.9,
                            fontSize: "0.95rem"
                        }}>
                            Complete management system for trainers and gyms.
                        </p>
                    </div>

                    {/* Test Credentials */}
                    <div style={{
                        padding: "20px",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "16px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                    }}>
                        <p style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            🎯 Test Credentials
                        </p>
                        <div style={{
                            fontSize: "0.85rem",
                            opacity: 0.95,
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                        }}>
                            <div><strong>Username:</strong> admin</div>
                            <div><strong>Password:</strong> 1234</div>
                        </div>
                        <p style={{
                            fontSize: "0.75rem",
                            opacity: 0.7,
                            marginTop: "10px"
                        }}>
                            View-Only Access
                        </p>
                    </div>

                    {/* Copyright */}
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                        © 2025 PowerHouse
                    </div>
                </div>

                {/* Login Form Section */}
                <div style={{
                    flex: 1.2,
                    padding: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "white"
                }}>
                    <h1 style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        marginBottom: "8px",
                        background: "linear-gradient(135deg, #22c55e, #4ade80)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        color: "#64748b",
                        marginBottom: "32px"
                    }}>
                        Sign in to your admin dashboard
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                marginBottom: "8px",
                                display: "block",
                                color: "#1e293b"
                            }}>
                                Email
                            </label>
                            <div style={{ position: "relative" }}>
                                <Mail
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#64748b"
                                    }}
                                />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@powerhouse.com"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 12px 12px 40px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "1rem",
                                        outline: "none",
                                        transition: "border-color 0.3s ease",
                                        color: "#1e293b",
                                        background: "#ffffff"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#22c55e";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e2e8f0";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                marginBottom: "8px",
                                display: "block",
                                color: "#1e293b"
                            }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#64748b"
                                    }}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 44px 12px 40px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        fontSize: "1rem",
                                        outline: "none",
                                        transition: "border-color 0.3s ease",
                                        color: "#1e293b",
                                        background: "#ffffff"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#22c55e";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e2e8f0";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#64748b",
                                        padding: "4px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: loading
                                    ? "#86efac"
                                    : "linear-gradient(135deg, #22c55e, #4ade80)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                marginTop: "10px",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: loading ? "none" : "0 4px 14px rgba(34, 197, 94, 0.4)"
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.5)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(34, 197, 94, 0.4)";
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: "18px",
                                        height: "18px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTop: "2px solid white",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite"
                                    }} />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer Text */}
                    <div style={{
                        marginTop: "30px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        textAlign: "center"
                    }}>
                        Don't have an account? <strong style={{
                            background: "linear-gradient(135deg, #22c55e, #4ade80)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            cursor: "pointer"
                        }}>Request Access</strong>
                    </div>

                    {/* Security Notice */}
                    <div style={{
                        marginTop: "20px",
                        padding: "12px",
                        background: "rgba(34, 197, 94, 0.08)",
                        borderRadius: "10px",
                        textAlign: "center",
                        border: "1px solid rgba(34, 197, 94, 0.2)"
                    }}>
                        <p style={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                            margin: 0
                        }}>
                            🔒 Secure admin area. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                input::placeholder {
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}