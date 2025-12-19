"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Sparkles, Check, ArrowRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const analysisSteps = [
    { label: "Detecting food items...", delay: 0 },
    { label: "Analyzing portions...", delay: 800 },
    { label: "Calculating macros...", delay: 1600 },
    { label: "Analysis complete!", delay: 2400 },
];

const nutritionData = {
    calories: 650,
    protein: 42,
    carbs: 55,
    fat: 28,
    items: [
        "Grilled Chicken Breast",
        "Brown Rice",
        "Steamed Broccoli",
        "Olive Oil Drizzle",
    ],
};

export default function AIDemo() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const startAnalysis = () => {
        setIsAnalyzing(true);
        setCurrentStep(0);
        setShowResults(false);

        analysisSteps.forEach((step, index) => {
            setTimeout(() => {
                setCurrentStep(index + 1);
                if (index === analysisSteps.length - 1) {
                    setTimeout(() => {
                        setIsAnalyzing(false);
                        setShowResults(true);
                    }, 500);
                }
            }, step.delay);
        });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".ai-demo-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="ai-demo" ref={sectionRef} className="ai-demo-section">
            {/* Section Header */}
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <div
                    className="section-badge"
                    style={{
                        background: "rgba(249, 115, 22, 0.1)",
                        borderColor: "rgba(249, 115, 22, 0.2)",
                    }}
                >
                    <Sparkles className="w-4 h-4" style={{ color: "#f97316" }} />
                    <span style={{ color: "#f97316" }}>Powered by Google Gemini</span>
                </div>
                <h2 className="section-title">
                    AI That Sees
                    <br />
                    <span className="gradient-text-orange">What You Eat</span>
                </h2>
                <p className="section-subtitle">
                    Simply point your camera at any meal. Our AI instantly identifies
                    every ingredient and calculates precise nutritional information.
                </p>
            </div>

            {/* Demo Interface */}
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div className="ai-demo-card">
                    {/* Animated background glow */}
                    <div
                        className="ai-demo-glow"
                        style={{ opacity: isAnalyzing ? 0.3 : 0.1 }}
                    />

                    <div className="ai-demo-grid">
                        {/* Food Image Placeholder */}
                        <div style={{ position: "relative" }}>
                            <div className="ai-demo-image-container">
                                <Image
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                                    alt="Healthy Meal"
                                    fill
                                    className="object-cover rounded-2xl"
                                />
                                {/* Scanning overlay */}
                                {isAnalyzing && (
                                    <div className="scan-overlay">
                                        <div className="scan-border" />
                                        <div className="scan-line" />
                                    </div>
                                )}
                                {/* Success checkmark */}
                                {showResults && (
                                    <div className="success-overlay">
                                        <div className="success-icon">
                                            <Check className="w-10 h-10 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Analysis Steps */}
                            {isAnalyzing && (
                                <div className="analysis-steps">
                                    {analysisSteps.map((step, index) => (
                                        <div
                                            key={step.label}
                                            className={`analysis-step ${index < currentStep ? "active" : "inactive"
                                                }`}
                                        >
                                            {index < currentStep ? (
                                                <Check className="step-check" />
                                            ) : (
                                                <div className="step-circle" />
                                            )}
                                            <span style={{ fontSize: "0.875rem" }}>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results Panel */}
                        <div className="ai-demo-results">
                            {showResults ? (
                                <>
                                    {/* Calorie Display */}
                                    <div className="calories-card">
                                        <div className="calories-label">Total Calories</div>
                                        <div className="calories-value">{nutritionData.calories}</div>
                                        <div className="calories-unit">kcal</div>
                                    </div>

                                    {/* Macros */}
                                    <div className="macros-grid">
                                        <div className="macro-card">
                                            <div className="macro-value protein">
                                                {nutritionData.protein}g
                                            </div>
                                            <div className="macro-label">Protein</div>
                                        </div>
                                        <div className="macro-card">
                                            <div className="macro-value carbs">
                                                {nutritionData.carbs}g
                                            </div>
                                            <div className="macro-label">Carbs</div>
                                        </div>
                                        <div className="macro-card">
                                            <div className="macro-value fat">{nutritionData.fat}g</div>
                                            <div className="macro-label">Fat</div>
                                        </div>
                                    </div>

                                    {/* Detected Items */}
                                    <div className="detected-items">
                                        <h4>Detected Items</h4>
                                        {nutritionData.items.map((item) => (
                                            <div key={item} className="detected-item">
                                                <Check />
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={startAnalysis} className="try-again-button">
                                        Try Again
                                    </button>
                                </>
                            ) : (
                                <div className="ai-demo-placeholder">
                                    <Camera
                                        className="w-16 h-16"
                                        style={{ color: "#888", margin: "0 auto" }}
                                    />
                                    <h3>Try AI Meal Scanning</h3>
                                    <p>Click the button below to see our AI in action</p>
                                    <button
                                        onClick={startAnalysis}
                                        disabled={isAnalyzing}
                                        className="scan-button"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="spinner" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Scan Meal
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}