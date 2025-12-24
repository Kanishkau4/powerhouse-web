"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Minimize2, Maximize2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

// Pre-defined responses for common questions
const botResponses: Record<string, string> = {
    default: "I'm the PowerHouse AI assistant! I can help you with questions about our gym, the app, workouts, nutrition, and more. What would you like to know?",
    greeting: "Hello! 👋 Welcome to PowerHouse! I'm here to help you with any questions about our gym, fitness app, or your wellness journey. How can I assist you today?",
    gym: "PowerHouse is a state-of-the-art fitness facility featuring:\n\n• 24/7 access for members\n• Modern equipment and free weights\n• Personal training services\n• Group fitness classes\n• AI-powered fitness tracking app\n• Nutrition guidance\n\nWould you like to know more about any specific feature?",
    app: "The PowerHouse App is your AI-powered fitness companion! Key features include:\n\n🍽️ **AI Meal Scanner** - Snap a photo to get instant nutrition info\n💪 **Workout Tracking** - Log exercises and track progress\n🏆 **Gamification** - Earn XP, badges, and compete on leaderboards\n📊 **Analytics** - Detailed insights into your fitness journey\n\nDownload it free on iOS and Android!",
    membership: "We offer flexible membership plans:\n\n• **Basic** - Gym access during staffed hours\n• **Premium** - 24/7 access + group classes\n• **Elite** - All Premium benefits + personal training sessions\n\nAll plans include free access to the PowerHouse App! Would you like to schedule a tour?",
    hours: "Our gym hours are:\n\n📍 **Staffed Hours:**\nMon-Fri: 6AM - 10PM\nSat-Sun: 8AM - 8PM\n\n🔑 **24/7 Access:**\nPremium and Elite members enjoy round-the-clock access with key card entry.\n\nAny other questions?",
    location: "We're located in the heart of the city! Visit us at:\n\n📍 123 Fitness Street\nDowntown, Your City\n\nFree parking available. We're also accessible by public transit - just 2 blocks from Central Station!\n\nWant directions or to schedule a visit?",
    trainer: "Our certified personal trainers can help you:\n\n• Create customized workout plans\n• Learn proper form and technique\n• Stay motivated and accountable\n• Reach your goals faster\n\nBook a free consultation through the app or at the front desk!",
    classes: "We offer exciting group fitness classes:\n\n🔥 **HIIT** - High-intensity interval training\n🧘 **Yoga** - Various styles from beginner to advanced\n🚴 **Spin** - Indoor cycling sessions\n💪 **Strength** - Weight training classes\n🥊 **Boxing** - Cardio kickboxing\n\nCheck the app for the weekly schedule!",
    nutrition: "The PowerHouse App includes powerful nutrition features:\n\n📸 **AI Meal Scanner** - Point your camera at any meal for instant macro breakdown\n📝 **Food Logging** - Track calories and nutrients\n🍳 **Recipes** - Healthy meal ideas with nutritional info\n💡 **Tips** - Daily nutrition advice from experts\n\nNeed help with your diet? Our app makes it easy!",
};

function getBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return botResponses.greeting;
    }
    if (lowerMessage.includes("gym") || lowerMessage.includes("facility") || lowerMessage.includes("about")) {
        return botResponses.gym;
    }
    if (lowerMessage.includes("app") || lowerMessage.includes("download") || lowerMessage.includes("mobile")) {
        return botResponses.app;
    }
    if (lowerMessage.includes("membership") || lowerMessage.includes("price") || lowerMessage.includes("plan") || lowerMessage.includes("cost")) {
        return botResponses.membership;
    }
    if (lowerMessage.includes("hour") || lowerMessage.includes("open") || lowerMessage.includes("time")) {
        return botResponses.hours;
    }
    if (lowerMessage.includes("location") || lowerMessage.includes("address") || lowerMessage.includes("where")) {
        return botResponses.location;
    }
    if (lowerMessage.includes("trainer") || lowerMessage.includes("personal") || lowerMessage.includes("coach")) {
        return botResponses.trainer;
    }
    if (lowerMessage.includes("class") || lowerMessage.includes("yoga") || lowerMessage.includes("hiit") || lowerMessage.includes("spin")) {
        return botResponses.classes;
    }
    if (lowerMessage.includes("nutrition") || lowerMessage.includes("food") || lowerMessage.includes("meal") || lowerMessage.includes("diet")) {
        return botResponses.nutrition;
    }

    return "I'd be happy to help with that! For specific inquiries, you can:\n\n• Visit our **About** page for gym info\n• Check the **App Guide** for app features\n• Call us at (555) 123-4567\n• Email: support@powerhouse.gym\n\nIs there anything else I can help you with?";
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: botResponses.default,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        const currentInput = input.trim();
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            // Call the API route with conversation history
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    conversationHistory: messages.slice(1), // Exclude welcome message
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error('Chat error:', error);

            // Fallback to predefined responses if API fails
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: error instanceof Error && error.message.includes('API key')
                    ? "⚠️ AI features require an API key. Using basic responses.\n\n" + getBotResponse(currentInput)
                    : "I'm having trouble connecting right now. Please try again in a moment!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "Tell me about the gym",
        "How does the app work?",
        "What are the membership plans?",
        "Gym hours?",
    ];

    if (!isOpen) return null;

    return (
        <div className={`chatbot-container ${isMinimized ? "minimized" : ""}`}>
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-header-info">
                    <div className="chatbot-avatar">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3>PowerHouse AI</h3>
                        <span className="chatbot-status">
                            <span className="status-dot" />
                            Online
                        </span>
                    </div>
                </div>
                <div className="chatbot-header-actions">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="chatbot-action-btn"
                        aria-label={isMinimized ? "Maximize" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="chatbot-action-btn"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.role}`}
                            >
                                <div className="message-avatar">
                                    {message.role === "assistant" ? (
                                        <Bot size={16} />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <div className="message-content">
                                    <p style={{ whiteSpace: "pre-line" }}>{message.content}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message assistant">
                                <div className="message-avatar">
                                    <Bot size={16} />
                                </div>
                                <div className="message-content typing">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 2 && (
                        <div className="quick-questions">
                            {quickQuestions.map((question) => (
                                <button
                                    key={question}
                                    onClick={() => {
                                        setInput(question);
                                        setTimeout(() => handleSend(), 100);
                                    }}
                                    className="quick-question-btn"
                                >
                                    <Sparkles size={12} />
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="chatbot-input">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="send-btn"
                            aria-label="Send message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </>
            )}

            <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 400px;
          max-height: 600px;
          background: #0f0f0f;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          z-index: 1001;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        .chatbot-container.minimized {
          max-height: auto;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chatbot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .chatbot-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chatbot-header-actions {
          display: flex;
          gap: 8px;
        }

        .chatbot-action-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .chatbot-action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 350px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 90%;
        }

        .message.user {
          flex-direction: row-reverse;
          margin-left: auto;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.assistant .message-avatar {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .message.user .message-avatar {
          background: rgba(255, 255, 255, 0.1);
          color: #888;
        }

        .message-content {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 16px;
          border-radius: 16px;
        }

        .message.assistant .message-content {
          border-top-left-radius: 4px;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border-top-right-radius: 4px;
        }

        .message-content p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #e0e0e0;
        }

        .message.user .message-content p {
          color: white;
        }

        .message-time {
          display: block;
          font-size: 0.7rem;
          color: #666;
          margin-top: 6px;
        }

        .message.user .message-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .message-content.typing {
          display: flex;
          gap: 4px;
          padding: 16px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .quick-questions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 20px 16px;
        }

        .quick-question-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22c55e;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-question-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
        }

        .chatbot-input {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }

        .chatbot-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .chatbot-input input:focus {
          border-color: #22c55e;
        }

        .chatbot-input input::placeholder {
          color: #666;
        }

        .send-btn {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chatbot-container {
            width: calc(100% - 32px);
            right: 16px;
            bottom: 16px;
            max-height: 80vh;
          }

          .chatbot-messages {
            max-height: 300px;
          }
        }
      `}</style>
        </div>
    );
}