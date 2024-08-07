import { NextResponse } from 'next/server';
import connect  from '@/lib/db';
export async function GET() {
    try{
        await connect();
        console.log("cron job running");
    } catch (error) {
        console.log("cron:", error);
        return NextResponse.json(error);
    }

    
    // Add your code here
    return NextResponse.json({ ok: true });
}