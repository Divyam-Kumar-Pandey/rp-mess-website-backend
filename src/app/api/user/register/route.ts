import { ERROR_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import HallMember from "@/lib/models/hallMember";
import User from "@/lib/models/user";
import TempUser from "@/lib/models/tempUser";
import generateTokens from "@/lib/services/generateTokens";
var bcrypt = require('bcrypt');


export async function POST(req: Request) {
    
    const userData = await req.json();
    
    /* 
        Sample Request Body {
        "rollNumber": "123456",
        "password": "password",
        "name": "John Doe",
        }
    */

   //safety checks
   if (!userData.rollNumber || !userData.password || !userData.name) {
       return ERROR_RESPONSE("Invalid Request Body.", 400);
    }
    
    await connect();
    const user = await HallMember.findOne({ rollNumber: userData.rollNumber.toUpperCase().trim() });

    
    if (!user) {
        return ERROR_RESPONSE("User does not exist", 404);
    }
    const currRole : String = user.role; // this will be a single string value

    // check if the user already exists
    const existingUser = await User.findOne({ rollNumber: userData.rollNumber.toUpperCase().trim() });

    if (existingUser) {
        return ERROR_RESPONSE("User already exists", 409);
    }

    // hash the password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // check if the user is already registered and delete the previous entry
    await TempUser.deleteOne({ rollNumber: userData.rollNumber.toUpperCase() });

    let newUser;
    try {
        newUser = new TempUser({
            rollNumber: userData.rollNumber.toUpperCase(),
            password: hashedPassword,
            email: user.email,
            name: userData.name,
            role: [currRole],
        });
    
        await newUser.save();
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }

    return Response.json({
        "success": true,
        "data": {
            "user": {
                "rollNumber": newUser.rollNumber,
                "email": newUser.email,
                "role": newUser.role,
            },
            'token': generateTokens(newUser.rollNumber, 'temp'),
        },
        "error": null,
    }, { status: 201 });   
}