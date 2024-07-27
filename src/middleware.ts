import { NextRequest, NextResponse } from "next/server";
import { UNAUTHORISED_RESPONSE } from "./app/constants";
const SECRET = process.env.SECRET;

const allowedPathsForAll = [
    '/api/user/login',
    '/api/user/register',
    '/api/verify-email',
];

export function middleware(req: NextRequest) {

    const token = req.headers.get('Authorization');
    const url = req.nextUrl.pathname;
    if(allowedPathsForAll.includes(url)){
        return NextResponse.next();
    }

    if (!token) {
        console.log("No token found : from middleware");
        return UNAUTHORISED_RESPONSE;
    }
    return NextResponse.next();
}

export const config = {
    matcher : ["/api/:path*"]

}