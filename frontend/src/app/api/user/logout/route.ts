import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: Request): Promise<NextResponse> {
    try {
        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        response.cookies.delete('token');

        return response;
    } catch (error) {
        console.error('Logout error:', error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}