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
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "The AI meal scanner is a game-changer. I used to spend 10 minutes logging every meal. Now it takes 2 seconds!",
        rating: 5,
    },
    {
        name: "Mike T.",
        role: "Fitness Enthusiast",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        content: "The gamification aspect keeps me coming back. I'm on a 90-day streak and don't want to break it!",
        rating: 5,
    },
    {
        name: "Jessica L.",
        role: "Marathon Runner",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        content: "Finally an app that understands athletes. The workout tracking is incredibly detailed and the AI suggestions are spot-on.",
        rating: 5,
    },
    {
        name: "David K.",
        role: "Personal Trainer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        content: "I recommend PowerHouse to all my clients. The progress tracking and achievement system motivates them like nothing else.",
        rating: 5,
    },
    {
        name: "Elena R.",
        role: "Yoga Instructor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        content: "The interface is so clean and premium. It makes tracking wellness feel like a reward rather than a chore.",
        rating: 5,
    },
    {
        name: "James W.",
        role: "Bodybuilder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        content: "Accurate macro tracking is essential for my prep, and PowerHouse delivers exactly what I need with zero friction.",
        rating: 5,
    }
];

export default function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const track = document.querySelector(".testimonials-track") as HTMLElement;
            if (!track) return;

            const totalWidth = track.scrollWidth;
            const halfWidth = totalWidth / 2;

            // Start at the negative offset (offset by one full set)
            gsap.set(track, { x: -halfWidth });

            // Animate moving to the right (towards 0)
            const animation = gsap.to(track, {
                x: 0,
                duration: 40,
                repeat: -1,
                ease: "none",
                onRepeat: () => {
                    // Reset back to negative half width at each loop
                    gsap.set(track, { x: -halfWidth });
                }
            });

            // Pause on hover
            const handleEnter = () => animation.pause();
            const handleLeave = () => animation.play();

            track.addEventListener("mouseenter", handleEnter);
            track.addEventListener("mouseleave", handleLeave);

            return () => {
                track.removeEventListener("mouseenter", handleEnter);
                track.removeEventListener("mouseleave", handleLeave);
            };
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

            {/* Testimonials Horizontal Track */}
            <div className="testimonials-container">
                <div className="testimonials-track">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div key={`${testimonial.name}-${index}`} className="testimonial-card">
                            <Quote className="testimonial-quote-icon" />
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="star-icon" />
                                ))}
                            </div>
                            <p className="testimonial-content">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>
                            <div className="testimonial-author">
                                <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                                <div>
                                    <div className="author-name">{testimonial.name}</div>
                                    <div className="author-role">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Side Gradients for fading effect */}
                <div className="testimonials-fade-left" />
                <div className="testimonials-fade-right" />
            </div>
        </section>
    );
}