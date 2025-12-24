"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/landing/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function GuidePage() {
    const [step, setStep] = useState(1);
    const phoneRef = useRef(null);

    const images = [
        "/assets/screen 01.png",
        "/assets/screen 02.png",
        "/assets/screen 03.png",
        "/assets/screen 04.png"
    ];

    useEffect(() => {
        const panels = gsap.utils.toArray(".step-panel");

        panels.forEach((panel: any, i) => {
            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                onEnter: () => setStep(i + 1),
                onEnterBack: () => setStep(i + 1),
            });
        });

        ScrollTrigger.create({
            trigger: ".guide-wrapper",
            start: "top top",
            end: "bottom bottom",
            pin: ".phone-sticky",
            pinSpacing: false,
            anticipatePin: 1,
        });
    }, []);

    return (
        <div className="guide-page">

            <div className="guide-wrapper">
                <div className="phone-sticky">
                    <div ref={phoneRef} className="phone-mockup">
                        <div className="phone-screen">
                            {/* Screen Content changes based on 'step' state */}
                            {images.map((img, i) => (
                                <div key={i} className={`screen-content ${step === i + 1 ? "active" : ""}`}>
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
                    <section className="step-panel">
                        <span className="step-num">01</span>
                        <h2>Scan Your Nutrition</h2>
                        <p>Stop typing in every ingredient. Point your camera at your plate and let Gemini AI do the heavy lifting. Instant macros, instant logging.</p>
                    </section>
                    <section className="step-panel">
                        <span className="step-num">02</span>
                        <h2>Log Every Set</h2>
                        <p>Track your strength progress with precision. Our intelligent logging system remembers your PRs and suggests weights for your next session.</p>
                    </section>
                    <section className="step-panel">
                        <span className="step-num">03</span>
                        <h2>Join a Team</h2>
                        <p>Connect with other PowerHouse members. Join team challenges and keep each other accountable through shared goals.</p>
                    </section>
                    <section className="step-panel">
                        <span className="step-num">04</span>
                        <h2>Level Up</h2>
                        <p>Earn XP for every workout and healthy meal. Unlock badges and climb the gym leaderboard to prove you&apos;re the best.</p>
                    </section>
                </div>
            </div>

            <div className="footer-spacer">
                <Footer />
            </div>

            <style jsx>{`
        .guide-page { background: #050505; color: white; display: flex; flex-direction: column; overflow: hidden; }
        .guide-wrapper { display: flex; position: relative; flex: 1; z-index: 1; }
        .footer-spacer { position: relative; z-index: 10; background: #050505; }
        .phone-sticky { 
          width: 50%; height: 100vh; display: flex; 
          align-items: center; justify-content: center; 
          padding-top: 120px; /* Moves the phone down further as requested */
          z-index: 1;
        }
        .phone-mockup {
          width: 280px; height: 580px; background: #0a0a0a;
          border-radius: 40px; padding: 12px; border: 4px solid #1a1a1a;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
          position: relative;
        }
        .phone-screen {
          width: 100%; height: 100%; background: #000;
          border-radius: 30px; overflow: hidden; position: relative;
        }
        .screen-content {
          position: absolute; inset: 0; opacity: 0; 
          transition: 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
          display: flex; align-items: center; justify-content: center;
        }
        .screen-content.active { opacity: 1; }
        .phone-screen-image {
          width: 100%; height: 100%; object-fit: cover;
        }
        
        .steps-content { width: 50%; }
        .step-panel {
          height: 100vh; display: flex; flex-direction: column;
          justify-content: center; padding: 0 10%;
        }
        .step-num { font-size: 5rem; font-weight: 900; opacity: 0.1; }
        .step-panel h2 { font-size: 3rem; margin: 20px 0; color: #22c55e; }
        .step-panel p { font-size: 1.2rem; color: #94a3b8; line-height: 1.6; }

        @media (max-width: 900px) {
          .phone-sticky { display: none; }
          .steps-content { width: 100%; }
        }
      `}</style>
        </div>
    );
}