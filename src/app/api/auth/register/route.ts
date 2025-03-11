import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        console.log("Register attempt with email:", email);

        // Better validation
        if (!name || !email || !password) {
            console.log("Missing fields in registration:", { name: !!name, email: !!email, password: !!password });
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Invalid email format:", email);
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            console.log("Password too short for:", email);
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log("User already exists:", email);
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Simplified approach: Create the user with the cart in a single operation
            const user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    cart: {
                        create: {} // Create an empty cart for the user
                    }
                },
                // Include the cart in the response to verify it was created
                include: {
                    cart: true
                }
            });

            console.log("User created successfully with ID:", user.id);
            console.log("Cart created with ID:", user.cart?.id);

            // Don't send password back to client
            const { password: _, ...userWithoutPassword } = user;

            return NextResponse.json(
                {
                    user: userWithoutPassword,
                    message: "User registered successfully"
                },
                { status: 201 }
            );
        } catch (dbError) {
            console.error("Database error during user creation:", dbError);

            // Better error handling for Prisma errors
            if (dbError instanceof PrismaClientKnownRequestError) {
                if (dbError.code === 'P2002') {
                    return NextResponse.json(
                        { error: "A user with this email already exists" },
                        { status: 409 }
                    );
                }
            }

            return NextResponse.json(
                {
                    error: "Database error during registration",
                    details: dbError instanceof Error ? dbError.message : String(dbError)
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                error: "An error occurred during registration",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
} 