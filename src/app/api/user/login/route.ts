import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/app/constants";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import generateTokens from "@/lib/services/generateTokens";
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');



export async function POST(req: Request) {
    /* 
        Sample Request Body {
            "rollNumber": "123456",
            "password": "password",
        }
    */
    const userData = await req.json();

    //safety checks
    if (!userData.rollNumber || !userData.password) {
        return Response.json({
            "success": false,
            "data": null,
            "error": "Invalid Request Body. Required fields: rollNumber, password",
        });
    }

    await connect();
    const user = await User.findOne({ rollNumber: userData.rollNumber });

    if (!user) {
        return Response.json({
            "success": false,
            "data": null,
            "error": "User does not exist",
        });
    }

    const passwordMatch = await bcrypt.compare(userData.password, user.password);

    if (!passwordMatch) {
        return Response.json({
            "success": false,
            "data": null,
            "error": "Invalid Password",
        });
    }

    return Response.json({
        "success": true,
        "data": {
            'user': {
                'rollNumber': user.rollNumber,
                'name': user.name,
                'email': user.email,
                'isEmailVerified': user.isEmailVerified,
                'position': user.position,
                'roomNumber': user.roomNumber,
                'profilePicture': user.profilePicture,
                'graduationYear': user.graduationYear,
                'isProfileComplete': user.isProfileComplete,
            },
            'token' : generateTokens(user.rollNumber),

        },
        "error": null,
    });
    
}