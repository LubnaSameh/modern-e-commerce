import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { searchFixedProducts } from '@/lib/fixedData';

// Define proper types to avoid 'any' type issues
interface ProductImage {
    id: string;
    url: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    mainImage: string;
    productImages: ProductImage[];
    category: {
        id: string;
        name: string;
    };
}

interface FormattedProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json([]);
        }

        // For debugging - log the query
        console.log(`Searching for: "${query}"`);

        // Get fixed products that match the query
        const fixedResults = searchFixedProducts(query);
        console.log(`Found ${fixedResults.length} fixed results`);

        // Database search results
        let dbResults: FormattedProduct[] = [];

        try {
            // First verify DB connection is working
            await db.$queryRaw`SELECT 1`;
            
            // Search for products that match the query in name or description
            try {
                // SQLite doesn't support case-insensitive searches with mode: 'insensitive'
                // We use standard contains which is case-sensitive in SQLite
                const products = await db.product.findMany({
                    where: {
                        OR: [
                            { 
                                name: { 
                                    contains: query 
                                }
                            },
                            { 
                                description: { 
                                    contains: query 
                                }
                            },
                            {
                                category: {
                                    name: {
                                        contains: query
                                    }
                                }
                            }
                        ]
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        mainImage: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    },
                    take: 10 // Limit results to 10 items
                });

                console.log(`Found ${products.length} database results`);

                // Format the database results
                dbResults = products.map((product: {
                    id: string;
                    name: string;
                    price: number;
                    description: string;
                    mainImage: string | null;
                    category: { name: string } | null;
                }) => {
                    return {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.mainImage || '',
                        category: product.category?.name || ''
                    };
                });
            } catch (prismaError) {
                console.error('Prisma query error:', prismaError);
                // Continue with only fixed results
            }
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            // Continue with only fixed results
        }

        // Combine both result sets and return
        const combinedResults = [...fixedResults, ...dbResults];
        
        // Limit to 20 combined results
        const limitedResults = combinedResults.slice(0, 20);
        
        return NextResponse.json(limitedResults);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search products: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
} 