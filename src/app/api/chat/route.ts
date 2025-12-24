import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message, conversationHistory } = await req.json();

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file' },
                { status: 500 }
            );
        }

        // Build conversation context with PowerHouse gym information
        const systemContext = `You are PowerHouse AI, a helpful and enthusiastic fitness assistant for PowerHouse Gym. 

Key Information about PowerHouse:
- A state-of-the-art fitness facility with 24/7 access for premium members
- Features modern equipment, free weights, personal training, and group fitness classes
- Has an AI-powered mobile app with meal scanning, workout tracking, gamification (XP, badges, leaderboards)
- Offers flexible membership plans: Basic (staffed hours), Premium (24/7 + classes), Elite (all + personal training)
- Staffed hours: Mon-Fri 6AM-10PM, Sat-Sun 8AM-8PM
- Located at 123 Fitness Street, Downtown (free parking, near Central Station)
- Group classes include HIIT, Yoga, Spin, Strength Training, and Boxing
- App features AI meal scanner (instant nutrition info), workout logging, progress analytics
- Contact: (555) 123-4567, support@powerhouse.gym

Be friendly, motivating, and concise. Focus on helping users with fitness questions, gym info, app features, and membership details. Keep responses conversational and under 150 words unless detailed information is requested.`;

        // Prepare messages for Gemini
        const messages = [
            { role: 'user', parts: [{ text: systemContext }] },
            { role: 'model', parts: [{ text: 'I understand! I\'m PowerHouse AI, ready to help with fitness, gym info, and our app features. How can I assist you today?' }] },
        ];

        // Add conversation history
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach((msg: any) => {
                if (msg.role === 'user') {
                    messages.push({ role: 'user', parts: [{ text: msg.content }] });
                } else if (msg.role === 'assistant') {
                    messages.push({ role: 'model', parts: [{ text: msg.content }] });
                }
            });
        }

        // Add current message
        messages.push({ role: 'user', parts: [{ text: message }] });

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: messages,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 500,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to get response from AI. Please check your API key.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm having trouble responding right now. Please try again!";

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
}
