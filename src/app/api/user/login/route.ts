import { ERROR_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import generateTokens from "@/lib/services/generateTokens";
var bcrypt = require('bcrypt');


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
        return ERROR_RESPONSE("Invalid Request Body.", 400);
    }

    await connect();
    const user = await User.findOne({ rollNumber: userData.rollNumber.toUpperCase().trim() });

    if (!user) {
        return ERROR_RESPONSE("User does not exist", 404);
    }

    const passwordMatch = await bcrypt.compare(userData.password, user.password);

    if (!passwordMatch) {
        return ERROR_RESPONSE("Invalid Password", 401);
    }

    return Response.json({
        "success": true,
        "data": {
            'user': {
                'rollNumber': user.rollNumber,
                'name': user.name,
                'email': user.email,
            },
            'token' : generateTokens(user.rollNumber),

        },
        "error": null,
    });
    
}