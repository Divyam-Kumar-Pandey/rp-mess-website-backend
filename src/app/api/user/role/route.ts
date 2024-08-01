import User from "@/lib/models/user";
import connect from "@/lib/db";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "@/app/constants";
var jwt = require('jsonwebtoken');

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET;
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
    } catch (error) {
        return ERROR_RESPONSE('Unauthorized', 401);
    }

    try{
        await connect();
        const user = await User.findOne({ rollNumber: decoded.rollNumber });
        if(!user){
            return ERROR_RESPONSE('User not found', 404);
        }
        return SUCCESS_RESPONSE(user.role, 200);
    }
    catch(error){
        return ERROR_RESPONSE(error, 500);
    }

}