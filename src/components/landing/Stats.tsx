"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 500, suffix: "K+", label: "Active Users" },
    { value: 10, suffix: "M+", label: "Meals Scanned" },
    { value: 2, suffix: "M+", label: "Workouts Logged" },
    { value: 4.9, suffix: "", label: "App Store Rating", decimal: true },
];

function AnimatedNumber({
    value,
    suffix,
    decimal = false,
}: {
    value: number;
    suffix: string;
    decimal?: boolean;
}) {
    const [displayValue, setDisplayValue] = useState(0);
    const numberRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;

        const ctx = gsap.context(() => {
            const obj = { val: 0 };

            ScrollTrigger.create({
                trigger: numberRef.current,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    hasAnimated.current = true;
                    gsap.to(obj, {
                        val: value,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            setDisplayValue(
                                decimal ? parseFloat(obj.val.toFixed(1)) : Math.floor(obj.val)
                            );
                        },
                    });
                },
            });
        });

        return () => ctx.revert();
    }, [value, decimal]);

    return (
        <span ref={numberRef}>
            {decimal ? displayValue.toFixed(1) : displayValue}
            {suffix}
        </span>
    );
}

export default function Stats() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="stats-section">
            <div className="stats-card">
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.label} className="stat-item">
                            <div className="stat-value">
                                <AnimatedNumber
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    decimal={stat.decimal}
                                />
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}