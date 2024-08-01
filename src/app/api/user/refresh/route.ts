import { SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import generateTokens from "@/lib/services/generateTokens";
var jwt = require('jsonwebtoken');


export async function POST(req: Request): Promise<Response> {
    /* 
        Must contain Authorization header with the refresh token
    */
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return UNAUTHORISED_RESPONSE;
    }

    // check if the token is valid
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET);
        if (decoded.tokenType !== "refresh") {
            return UNAUTHORISED_RESPONSE;
        }
    } catch (error) {
        return UNAUTHORISED_RESPONSE;
    }

    // generate new access and refresh tokens
    return SUCCESS_RESPONSE({
        'user': {
            'rollNumber' : decoded.rollNumber,
        },
        'token': generateTokens(decoded.rollNumber, 'access-only')
    }, 200);
}