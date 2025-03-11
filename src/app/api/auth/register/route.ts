import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { mockUsers } from "@/lib/mockData";

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

        // Check if user already exists in mock data
        const existingUser = mockUsers.find(user => user.email === email);

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
            // Create new user with mock data
            const userId = uuidv4();
            const cartId = `cart-${userId}`;

            const newUser = {
                id: userId,
                name,
                email,
                password: hashedPassword,
                role: "USER",
                createdAt: new Date(),
                updatedAt: new Date(),
                cart: { id: cartId, items: [] }
            };

            // Add to mock users
            mockUsers.push(newUser);

            console.log("User created successfully with ID:", newUser.id);
            console.log("Cart created with ID:", newUser.cart?.id);

            // Don't send password back to client
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _password, ...userWithoutPassword } = newUser;

            return NextResponse.json(
                {
                    user: userWithoutPassword,
                    message: "User registered successfully"
                },
                { status: 201 }
            );
        } catch (error) {
            console.error("Error during user creation:", error);
            return NextResponse.json(
                {
                    error: "Error during registration",
                    details: error instanceof Error ? error.message : String(error)
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