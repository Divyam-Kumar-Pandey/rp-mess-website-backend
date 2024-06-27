import { NextRequest, NextResponse } from "next/server";
const SECRET = process.env.SECRET;

export function middleware(req: NextRequest) {

    const token = req.headers.get('Authorization');
    // console.log(token);
    if (!token || token !== `Bearer ${SECRET}`) {
        // redirect to login page
        // return NextResponse.redirect(new URL('/login', req.url).toString());
        return new Response('Unauthorized', { status: 401 });
    }
    console.log(req.url);
    return NextResponse.next();
}

export const config = {
    matcher : ["/api/:path*"]
}