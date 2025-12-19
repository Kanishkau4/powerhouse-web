"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: "Sarah M.",
        role: "Lost 30 lbs in 4 months",
        avatar: "👩‍💼",
        content:
            "The AI meal scanner is a game-changer. I used to spend 10 minutes logging every meal. Now it takes 2 seconds!",
        rating: 5,
    },
    {
        name: "Mike T.",
        role: "Fitness Enthusiast",
        avatar: "👨‍💻",
        content:
            "The gamification aspect keeps me coming back. I'm on a 90-day streak and don't want to break it!",
        rating: 5,
    },
    {
        name: "Jessica L.",
        role: "Marathon Runner",
        avatar: "👩‍🎤",
        content:
            "Finally an app that understands athletes. The workout tracking is incredibly detailed and the AI suggestions are spot-on.",
        rating: 5,
    },
    {
        name: "David K.",
        role: "Personal Trainer",
        avatar: "👨‍🏫",
        content:
            "I recommend PowerHouse to all my clients. The progress tracking and achievement system motivates them like nothing else.",
        rating: 5,
    },
];

export default function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".testimonial-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="testimonials" ref={sectionRef} className="testimonials-section">
            {/* Section Header */}
            <div style={{ textAlign: "center" }}>
                <h2 className="section-title">
                    Loved by <span className="gradient-text">Thousands</span>
                </h2>
                <p className="section-subtitle">
                    See what our community has to say about their PowerHouse journey.
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.name} className="testimonial-card">
                        {/* Quote icon */}
                        <Quote className="testimonial-quote-icon" />

                        {/* Rating */}
                        <div className="testimonial-rating">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="star-icon" />
                            ))}
                        </div>

                        {/* Content */}
                        <p className="testimonial-content">
                            &ldquo;{testimonial.content}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="testimonial-author">
                            <div className="author-avatar">{testimonial.avatar}</div>
                            <div>
                                <div className="author-name">{testimonial.name}</div>
                                <div className="author-role">{testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}