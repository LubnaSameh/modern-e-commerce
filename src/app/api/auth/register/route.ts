import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

        // اتصال بقاعدة البيانات MongoDB
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const cartsCollection = db.collection('carts');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });

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
            // Create a new user
            const userData = {
                name,
                email,
                password: hashedPassword,
                role: "USER",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await usersCollection.insertOne(userData);
            const userId = result.insertedId;

            // Create an empty cart for the user
            const cartData = {
                userId: userId.toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const cartResult = await cartsCollection.insertOne(cartData);

            console.log("User created successfully with ID:", userId);
            console.log("Cart created with ID:", cartResult.insertedId);

            // Don't send password back to client
            const { password: _password, ...userWithoutPassword } = userData;

            return NextResponse.json(
                {
                    user: {
                        id: userId.toString(),
                        ...userWithoutPassword
                    },
                    message: "User registered successfully"
                },
                { status: 201 }
            );
        } catch (dbError) {
            console.error("Database error during user creation:", dbError);

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
            { error: "Registration failed", details: error instanceof Error ? error.message : String(error) },
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