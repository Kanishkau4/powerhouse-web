"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "400px",
        md: "600px",
        lg: "800px",
        xl: "1000px",
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div
                className="admin-modal"
                style={{ maxWidth: sizeClasses[size] }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="admin-modal-header">
                    <h2 className="admin-modal-title">{title}</h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="admin-modal-body">{children}</div>
                {footer && <div className="admin-modal-footer">{footer}</div>}
            </div>
        </div>
    );
}