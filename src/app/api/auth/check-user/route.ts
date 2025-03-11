import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({
                exists: false,
                message: 'Email parameter is required'
            }, { status: 400 });
        }

        // Check if a user with this email exists
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true } // Only select the ID field to minimize data exposure
        });

        // Return whether the user exists or not
        return NextResponse.json({
            exists: !!user,
            // Don't include any sensitive information in the response
        });
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return NextResponse.json({
            exists: false,
            message: 'An error occurred while checking user existence'
        }, { status: 500 });
    }
} 