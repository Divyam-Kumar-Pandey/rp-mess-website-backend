import User from "@/lib/models/user";
import connect from "@/lib/db";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "@/app/constants";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) { return ERROR_RESPONSE('Unauthorized', 401); }
    const auth = await isAuthorizedAsAnyOfThem(token, ['STUDENT', 'STAFF', 'ADMIN', 'SUPERADMIN']);

    try{
        await connect();
        const user = await User.findOne({ rollNumber: auth.data });
        if(!user){
            return ERROR_RESPONSE('User not found', 404);
        }
        return SUCCESS_RESPONSE(user.role, 200);
    }
    catch(error){
        return ERROR_RESPONSE(error, 500);
    }

}