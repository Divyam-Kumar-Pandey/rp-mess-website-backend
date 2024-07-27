import { ERROR_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import HallMember from "@/lib/models/hallMember";
import User from "@/lib/models/user";
import generateTokens from "@/lib/services/generateTokens";
var bcrypt = require('bcrypt');


export async function POST(req: Request) {
    
    const userData = await req.json();
    
    /* 
        Sample Request Body {
            "rollNumber": "123456",
        "password": "password",
        "email": "abc@gmail.com",
        "name": "John Doe",
        }
    */

   //safety checks
   if (!userData.rollNumber || !userData.password || !userData.email || !userData.name) {
       return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber, password, email, name", 400);
    }
    
    await connect();
    const user = await HallMember.findOne({ rollNumber: userData.rollNumber });
    const currRole : String = user.role; // this will be a single string value
    const canCreateAccount = user !== null;

    if (!canCreateAccount) {
        return ERROR_RESPONSE("User does not exist", 400);
    }

    // check if the user already exists
    const existingUser = await User.findOne({ rollNumber: userData.rollNumber });
    const existingUserEmail = await User.findOne({ email: userData.email });

    if (existingUser) {
        return ERROR_RESPONSE("User already exists", 400);
    }

    if (existingUserEmail) {
        return ERROR_RESPONSE("Email already exists", 400);
    }

    // hash the password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    let newUser;
    try {
        newUser = new User({
            rollNumber: userData.rollNumber,
            password: hashedPassword,
            email: userData.email,
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
                "id": newUser._id,
                "rollNumber": newUser.rollNumber,
                "email": newUser.email,
                "role": newUser.role,
            },
            'token': generateTokens(newUser.rollNumber),
        },
        "error": null,
    }, { status: 201 });   
}