var jwt = require('jsonwebtoken');
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/app/constants";

export default function generateTokens(rollNumber: string){
    const payloadAccessToken = {
        tokenType: "access",
        rollNumber: rollNumber,
        iat: Date.now(),
    }

    const payloadRefreshToken = {
        tokenType: "refresh",
        rollNumber: rollNumber,
        iat: Date.now(),
    }

    return {
        'accessToken': jwt.sign(
            payloadAccessToken, 
            process.env.SECRET, 
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        ),
        'refreshToken': jwt.sign(
            payloadRefreshToken, 
            process.env.SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        ),
    }
}