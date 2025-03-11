import { NextResponse } from 'next/server';
import { mockCategories } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("API Request - GET /api/categories");

        // Return the mock categories
        return NextResponse.json(mockCategories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Error fetching categories", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 