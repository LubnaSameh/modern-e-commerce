import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/models/User';

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

        // Check if a user with this email exists using MongoDB
        const user = await getUserByEmail(email);

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