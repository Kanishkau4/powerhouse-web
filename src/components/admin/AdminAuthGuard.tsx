"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, [pathname]);

    const checkAuthentication = async () => {
        // Don't check auth on login page
        if (pathname === "/admin/login") {
            setIsLoading(false);
            return;
        }

        const isAuth = await isAdminAuthenticated();

        if (!isAuth) {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    };

    // Show loading on protected pages
    if (isLoading && pathname !== "/admin/login") {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }}>
                <div style={{
                    textAlign: "center"
                }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        border: "6px solid rgba(255,255,255,0.3)",
                        borderTop: "6px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 24px"
                    }} />
                    <p style={{
                        color: "white",
                        fontSize: "1.125rem",
                        fontWeight: 600
                    }}>
                        Verifying authentication...
                    </p>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Show login page without guard
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show protected content only if authenticated
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Return null while redirecting
    return null;
}
