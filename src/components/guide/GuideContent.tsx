"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/landing/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function GuidePage() {
    const [step, setStep] = useState(1);
    const phoneRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);

    const images = [
        "/assets/screen 01.png",
        "/assets/screen 02.png",
        "/assets/screen 03.png",
        "/assets/screen 04.png"
    ];

    const steps = [
        {
            num: "01",
            title: "Scan Your Nutrition",
            desc: "Stop typing in every ingredient. Point your camera at your plate and let Gemini AI do the heavy lifting. Instant macros, instant logging."
        },
        {
            num: "02",
            title: "Log Every Set",
            desc: "Track your strength progress with precision. Our intelligent logging system remembers your PRs and suggests weights for your next session."
        },
        {
            num: "03",
            title: "Join a Team",
            desc: "Connect with other PowerHouse members. Join team challenges and keep each other accountable through shared goals."
        },
        {
            num: "04",
            title: "Level Up",
            desc: "Earn XP for every workout and healthy meal. Unlock badges and climb the gym leaderboard to prove you're the best."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray<HTMLElement>(".step-panel");

            panels.forEach((panel, i) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: "top center",
                    onEnter: () => setStep(i + 1),
                    onEnterBack: () => setStep(i + 1),
                });
            });

            if (stickyRef.current && wrapperRef.current) {
                ScrollTrigger.create({
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: stickyRef.current,
                    pinSpacing: false,
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="guide-page">
            {/* Desktop Layout */}
            <div className="guide-wrapper desktop-only" ref={wrapperRef}>
                <div className="phone-sticky" ref={stickyRef}>
                    <div ref={phoneRef} className="phone-mockup">
                        <div className="phone-notch"></div>
                        <div className="phone-screen">
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`screen-content ${step === i + 1 ? "active" : ""}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Step ${i + 1}`}
                                        className="phone-screen-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="steps-content">
                    {steps.map((s, i) => (
                        <section key={i} className="step-panel">
                            <span className="step-num">{s.num}</span>
                            <h2>{s.title}</h2>
                            <p>{s.desc}</p>
                        </section>
                    ))}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="mobile-only">
                <div className="mobile-header">
                    <h1>How It Works</h1>
                    <p>Your journey to a better you in 4 simple steps</p>
                </div>

                {steps.map((s, i) => (
                    <div key={i} className="mobile-step">
                        <div className="mobile-step-image">
                            <div className="mobile-phone-frame">
                                <img src={images[i]} alt={s.title} />
                            </div>
                        </div>
                        <div className="mobile-step-content">
                            <span className="mobile-step-num">{s.num}</span>
                            <h2>{s.title}</h2>
                            <p>{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="footer-spacer">
                <Footer />
            </div>

            <style jsx>{`
                .guide-page {
                    background: #050505;
                    color: white;
                    min-height: 100vh;
                }

                .guide-wrapper {
                    display: flex;
                    position: relative;
                    min-height: 100vh;
                }

                .footer-spacer {
                    position: relative;
                    z-index: 10;
                    background: #050505;
                }

                /* Desktop Styles */
                .phone-sticky {
                    width: 50%;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 60px; /* Moves phone down a little */
                    position: relative;
                }

                .phone-mockup {
                    width: 280px;
                    height: 580px;
                    background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
                    border-radius: 45px;
                    padding: 12px;
                    border: 3px solid #2a2a2a;
                    box-shadow: 
                        0 50px 100px rgba(0, 0, 0, 0.6),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    position: relative;
                }

                .phone-notch {
                    position: absolute;
                    top: 18px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 25px;
                    background: #000;
                    border-radius: 20px;
                    z-index: 10;
                }

                .phone-screen {
                    width: 100%;
                    height: 100%;
                    background: #111;
                    border-radius: 35px;
                    overflow: hidden;
                    position: relative;
                }

                .screen-content {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    transform: scale(0.95);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .screen-content.active {
                    opacity: 1;
                    transform: scale(1);
                }

                .phone-screen-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .steps-content {
                    width: 50%;
                    position: relative;
                }

                .step-panel {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 10%;
                }

                .step-num {
                    font-size: 5rem;
                    font-weight: 900;
                    line-height: 1;
                    color: #22c55e;
                    opacity: 0.35;
                    margin-bottom: 8px;
                }

                .step-panel h2 {
                    font-size: 2.8rem;
                    margin: 16px 0;
                    color: #22c55e;
                    font-weight: 700;
                }

                .step-panel p {
                    font-size: 1.15rem;
                    color: #94a3b8;
                    line-height: 1.7;
                    max-width: 400px;
                }

                /* Mobile Layout - Hidden on Desktop */
                .mobile-only {
                    display: none;
                }

                .desktop-only {
                    display: flex;
                }

                @media (max-width: 900px) {
                    .desktop-only {
                        display: none;
                    }

                    .mobile-only {
                        display: block;
                        padding: 0 24px;
                    }

                    .mobile-header {
                        text-align: center;
                        padding: 80px 0 40px;
                    }

                    .mobile-header h1 {
                        font-size: 2.2rem;
                        font-weight: 800;
                        margin-bottom: 12px;
                        background: linear-gradient(135deg, #22c55e, #16a34a);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .mobile-header p {
                        color: #64748b;
                        font-size: 1rem;
                    }

                    .mobile-step {
                        margin-bottom: 60px;
                        padding-bottom: 60px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    }

                    .mobile-step:last-child {
                        border-bottom: none;
                        margin-bottom: 40px;
                    }

                    .mobile-step-image {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 32px;
                    }

                    .mobile-phone-frame {
                        width: 200px;
                        height: 420px;
                        background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
                        border-radius: 32px;
                        padding: 8px;
                        border: 2px solid #2a2a2a;
                        box-shadow: 
                            0 25px 50px rgba(0, 0, 0, 0.5),
                            0 0 0 1px rgba(255, 255, 255, 0.03);
                    }

                    .mobile-phone-frame img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 26px;
                    }

                    .mobile-step-content {
                        text-align: center;
                    }

                    .mobile-step-num {
                        display: inline-block;
                        font-size: 0.85rem;
                        font-weight: 700;
                        color: #22c55e;
                        background: rgba(34, 197, 94, 0.1);
                        padding: 6px 16px;
                        border-radius: 20px;
                        margin-bottom: 16px;
                        border: 1px solid rgba(34, 197, 94, 0.2);
                    }

                    .mobile-step-content h2 {
                        font-size: 1.6rem;
                        font-weight: 700;
                        color: #fff;
                        margin-bottom: 12px;
                    }

                    .mobile-step-content p {
                        font-size: 1rem;
                        color: #94a3b8;
                        line-height: 1.7;
                        max-width: 320px;
                        margin: 0 auto;
                    }
                }
            `}</style>
        </div>
    );
}
