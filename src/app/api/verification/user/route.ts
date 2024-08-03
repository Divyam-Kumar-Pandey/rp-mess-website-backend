import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import TempUser from "@/lib/models/tempUser";
import { verifyTempToken } from "@/lib/services/auth";


export async function GET(request: Request): Promise<Response> {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) { return UNAUTHORISED_RESPONSE; }

    // check if the token is valid
    let decoded = verifyTempToken(token).data;
    if (!decoded) { return UNAUTHORISED_RESPONSE; } 

    try {
        await connect();
        const user = await TempUser.findOne({ rollNumber: decoded.rollNumber });
        return SUCCESS_RESPONSE({
            'rollNumber': user.rollNumber,
            'email': user.email,
            'name': user.name,
        }, 200);
      } catch (error) {
        return ERROR_RESPONSE(error, 500);
      }
}

