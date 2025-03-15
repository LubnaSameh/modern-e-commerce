import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import type { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import { getUserByEmail } from "@/models/User";

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

// احصل على عنوان URL الصحيح للتطبيق
const getBaseUrl = () => {
    // استخدم القيمة من متغيرات البيئة إذا كانت موجودة
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
    }

    // في بيئة الإنتاج، يجب تحديد NEXTAUTH_URL
    if (process.env.NODE_ENV === "production") {
        // fallback لحالة عدم تعيين NEXTAUTH_URL في الإنتاج
        const prodUrl = "https://e-commerce-lubna-sameh-mohameds-projects.vercel.app";
        console.log("⚠️ Missing NEXTAUTH_URL in production, using fallback:", prodUrl);
        return prodUrl;
    }

    // للتطوير المحلي
    return "http://localhost:3003";
};

// تسجيل معلومات التهيئة للتشخيص
console.log("🔐 NextAuth Configuration:");
console.log(`- Environment: ${process.env.NODE_ENV}`);
console.log(`- Base URL: ${getBaseUrl()}`);
console.log(`- Google Provider: ${process.env.GOOGLE_CLIENT_ID ? "Configured" : "Not Configured"}`);

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
                // البحث عن المستخدم باستخدام MongoDB
                const user = await getUserByEmail(credentials.email);

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
                    id: user._id.toString(),
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

// تحديد ما إذا كان يجب تعيين ملفات تعريف الارتباط الآمنة بناءً على البيئة
const useSecureCookies = process.env.NODE_ENV === "production";
console.log(`- Using secure cookies: ${useSecureCookies ? "Yes" : "No"}`);

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
    cookies: {
        sessionToken: {
            name: useSecureCookies
                ? `__Secure-next-auth.session-token`
                : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 30 * 24 * 60 * 60 // 30 days
            }
        },
        callbackUrl: {
            name: useSecureCookies
                ? `__Secure-next-auth.callback-url`
                : `next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        csrfToken: {
            name: useSecureCookies
                ? `__Host-next-auth.csrf-token`
                : `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        }
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

            // استخدم عنوان URL المحدد من الدالة المساعدة بدلاً من baseUrl
            const effectiveBaseUrl = getBaseUrl();
            console.log(`- Effective base URL: ${effectiveBaseUrl}`);

            // Check for callback loops involving login page
            if (url.includes('/auth/login') && url.includes('callbackUrl')) {
                console.log('NextAuth: Detected potential callback loop, redirecting to home');
                return effectiveBaseUrl;
            }

            // For sign-out, always redirect to the current origin
            if (url.includes('/signout') || url.includes('/api/auth/signout') || url.includes('/logout')) {
                console.log('NextAuth: Sign-out detected, redirecting to origin');
                return effectiveBaseUrl;
            }

            // Allows relative callback URLs
            if (url.startsWith("/")) {
                const fullUrl = `${effectiveBaseUrl}${url}`;
                console.log(`- Relative URL converted to absolute: ${fullUrl}`);
                return fullUrl;
            }

            // Check if URL is already absolute
            if (url.startsWith('http')) {
                // Ensure the URL is within our domain for security
                const urlObj = new URL(url);
                const baseUrlObj = new URL(effectiveBaseUrl);

                if (urlObj.host === baseUrlObj.host) {
                    console.log(`- Using provided absolute URL: ${url}`);
                    return url;
                } else {
                    console.log(`- External URL detected, redirecting to home: ${url}`);
                    return effectiveBaseUrl;
                }
            }

            // For all other cases, return to base URL
            console.log(`- Using default base URL: ${effectiveBaseUrl}`);
            return effectiveBaseUrl;
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

        // تسجيل معلومات الطلب للتشخيص
        console.log('🔑 Auth Request Info:');
        console.log(`- URL: ${req.url}`);
        console.log(`- Method: ${req.method}`);
        console.log(`- Headers: ${JSON.stringify({
            origin: req.headers.get('origin'),
            host: req.headers.get('host'),
            referer: req.headers.get('referer')
        })}`);

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
                    const baseUrl = getBaseUrl();

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