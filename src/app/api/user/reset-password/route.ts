import { ERROR_RESPONSE, SALT_ROUNDS, SUCCESS_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import User from "@/lib/models/user";
var bcrypt = require('bcrypt');



export default async function POST(req: Request) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    /* 
        Sample Request Body {
            "rollNumber": "123456",
            "newPassword": "password",
        }
    */
    const userData = await req.json();

    //safety checks
    if (!userData.rollNumber || !userData.newPassword) {
        return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber, newPassword", 400);
    }

    try {
        await connect();
        const user = await User.findOne({ rollNumber: userData.rollNumber });
        if (!user) {
            return ERROR_RESPONSE("User does not exist", 400);
        }

        // hash the password
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(userData.newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return SUCCESS_RESPONSE("Password updated successfully", 200);

    } catch (error) {
        return ERROR_RESPONSE(error, 500);
        
    }

}