import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import User from "@/lib/models/user";
import HallMember from "@/lib/models/hallMember";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["STUDENT", "STAFF","ADMIN", "SUPERADMIN"]);
    if (!auth.success) {
      return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(req.url).searchParams;
    const rollNumber = params.get("rollNumber")?.toUpperCase().trim();

    if(!rollNumber) { return ERROR_RESPONSE("Error: \"rollNumber\" not provided", 400); }

    try{
        const user = await User.findOne({rollNumber: rollNumber});
        if(!user) { 
            // check in hall members
            const hallMember = await HallMember.findOne({rollNumber: rollNumber});
            if(!hallMember) {
                return ERROR_RESPONSE("User not found", 404);
            }
            return SUCCESS_RESPONSE({
                rollNumber: "NOT REGISTERED",
                name: "NOT REGISTERED",
                email: "NOT REGISTERED",
                position: "NOT REGISTERED",
                roomNumber: "NOT REGISTERED",
                profilePicture: "NOT REGISTERED",
                graduationYear: "0000",
                isProfileComplete: "NOT REGISTERED",
                role: hallMember.role,
            }, 200);
        }
        return Response.json({
            success: true,
            data: {
                rollNumber: user.rollNumber,
                name: user.name,
                email: user.email,
                position: user.position,
                roomNumber: user.roomNumber,
                profilePicture: user.profilePicture,
                graduationYear: user.graduationYear,
                isProfileComplete: user.isProfileComplete,
                role: user.role,
            },
            error: null
        }, {status: 200});
    } catch(e) {
        return ERROR_RESPONSE("Internal Server Error", 500);
    }
}