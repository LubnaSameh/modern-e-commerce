import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import type { NextAuthOptions } from "next-auth";
import type { AuthOptions } from "next-auth";
import { Session } from "next-auth";

// تعريف واجهة ممتدة لنوع المستخدم
interface ExtendedUser {
    id?: string;
    role?: string;
    name?: string;
    email?: string;
    image?: string;
}

// تعريف واجهة ممتدة للجلسة
interface ExtendedSession extends Session {
    user: ExtendedUser;
}

// Define providers array with proper type
const providers: AuthOptions["providers"] = [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                console.log("Missing credentials");
                return null;
            }

            try {
                // Find the user by email
                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                console.log("User lookup for:", credentials.email);

                // If no user found or password doesn't match
                if (!user) {
                    console.log("User not found:", credentials.email);
                    return null;
                }

                // Compare password with hashed password in database
                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordMatch) {
                    console.log("Password does not match for:", credentials.email);
                    return null;
                }

                console.log("Authentication successful for user:", user.email);

                // Return user data (without password)
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            } catch (error) {
                console.error("Auth error:", error);
                return null;
            }
        }
    })
];

// Add Google provider only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "USER" // Default role for Google auth users
                };
            }
        })
    );
}

const handler = NextAuth({
    providers,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 5 * 60, // 5 minutes - update more frequently
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback called", { userExists: !!user, tokenId: token?.id });

            if (user) {
                token.id = user.id;
                token.role = user.role || "USER";
                token.name = user.name;
                token.email = user.email;
                console.log("JWT updated with user data", { userId: user.id, role: user.role, name: user.name });
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session callback called", { sessionExists: !!session, tokenId: token?.id });

            if (session.user && token) {
                const extendedSession = session as ExtendedSession;
                extendedSession.user.id = token.id as string;
                extendedSession.user.role = token.role as string;
                // Make sure name and email are copied over
                extendedSession.user.name = token.name as string;
                extendedSession.user.email = token.email as string;
                return extendedSession;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            console.log('NextAuth redirect callback:', { url, baseUrl });

            // Check for callback loops involving login page
            if (url.includes('/auth/login') && url.includes('callbackUrl')) {
                console.log('NextAuth: Detected potential callback loop, redirecting to home');
                return baseUrl;
            }

            // For sign-out, always redirect to the current origin
            if (url.includes('/signout') || url.includes('/api/auth/signout') || url.includes('/logout')) {
                console.log('NextAuth: Sign-out detected, redirecting to origin');

                // For sign-out, we'll always redirect to the base URL to avoid port issues
                return baseUrl;
            }

            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            // For all other cases, return to base URL
            return baseUrl;
        },
    },
    debug: process.env.NODE_ENV === "development",
});

// Custom handler to properly handle exceptions
async function authHandler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
    try {
        // Get the origin from the request to use in redirects
        const origin = req.headers.get('origin') || req.headers.get('host') || '';
        console.log('Auth request origin/host:', origin);

        // Add special handling for sign-out paths
        const { pathname } = new URL(req.url);
        if (pathname.includes('/signout') || pathname.includes('/logout')) {
            console.log('NextAuth: Custom sign-out handling, detected origin:', origin);

            // Ensure we return proper JSON for sign-out
            if (req.method === 'POST') {
                const response = await handler(req, ctx);

                // Make sure we're returning valid JSON
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    // Get the base URL from environment or fallback to request origin
                    const baseUrl = process.env.NEXTAUTH_URL ||
                        (typeof window !== 'undefined' ? window.location.origin : '') ||
                        new URL(req.url).origin ||
                        '/';

                    // Return a proper JSON response with the correct URL
                    return NextResponse.json({
                        success: true,
                        url: baseUrl
                    });
                }
                return response;
            }
        }

        return handler(req, ctx);
    } catch (error) {
        console.error('NextAuth API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', success: false },
            { status: 500 }
        );
    }
}

export { authHandler as GET, authHandler as POST }; 