"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Chatbot from "@/components/landing/Chatbot";

export default function NavbarWrapper() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return null;
    }

    return (
        <>
            <Navbar onChatOpen={() => setIsChatOpen(true)} />
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
