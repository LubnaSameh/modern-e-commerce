import { NextResponse } from 'next/server';

// For simplicity, we'll use an in-memory store for the last notification timestamp
// In a production app, you'd use a more robust solution like Redis, database, or WebSockets
let lastNotificationTimestamp = Date.now();
let lastEvent = '';

export async function GET() {
    try {
        // Return the last notification information
        return NextResponse.json({
            lastNotification: lastNotificationTimestamp,
            event: lastEvent
        });
    } catch (error) {
        console.error('Error getting notification data:', error);
        return NextResponse.json(
            { error: 'Failed to get notification data' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.event) {
            return NextResponse.json(
                { error: 'Event type is required' },
                { status: 400 }
            );
        }

        // Update the last notification timestamp and event
        lastNotificationTimestamp = data.data?.timestamp || Date.now();
        lastEvent = data.event;

        return NextResponse.json({
            success: true,
            message: 'Notification received',
            timestamp: lastNotificationTimestamp
        });
    } catch (error) {
        console.error('Error processing notification:', error);
        return NextResponse.json(
            { error: 'Failed to process notification' },
            { status: 500 }
        );
    }
} 