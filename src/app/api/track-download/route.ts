import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const referrer = request.headers.get('referer') || 'Direct';
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'Unknown';

        // Get optional source from request body
        const body = await request.json().catch(() => ({}));
        const source = body.source || 'unknown';

        const { error } = await supabase
            .from('analytics_events')
            .insert({
                event_type: 'app_download',
                event_data: {
                    source: source,
                    version: 'V1.0.0',
                    timestamp: new Date().toISOString()
                },
                user_agent: userAgent,
                ip_address: ip,
                referrer: referrer
            });

        if (error) {
            console.error('Error tracking download:', error);
            return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
