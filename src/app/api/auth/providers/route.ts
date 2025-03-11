import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Create an object with the available auth providers
        // Define a proper interface for the providers object
        interface AuthProviders {
            credentials: boolean;
            google?: boolean; // Make google optional since it may not be available
        }
        
        const providers: AuthProviders = {
            credentials: true, // Credentials are always available
        };

        // Check if Google provider is configured
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
            providers.google = true;
        }

        // Set CORS headers to allow client-side requests
        return new NextResponse(JSON.stringify(providers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('Error in providers API:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
} 