import { ERROR_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import User from "@/lib/models/user";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["STUDENT", "STAFF","ADMIN", "SUPERADMIN"]);
    if (!auth.success) {
      return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(req.url).searchParams;
    const forNavbar = params.get("forNavbar") === "true";

    const user = await User.findOne({rollNumber: auth.data});

    if(!user) { return ERROR_RESPONSE("User not found", 404); }

    if(forNavbar) {
        return Response.json({
            success: true,
            data: {
                name: user.name,
                profilePicture: user.profilePicture,
                role: user.role,
            },
            error: null
        })
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

}

export async function PATCH(req: Request) {

    /*
        Sample request body:
        {
            "name": "John Doe", (optional)
            "email": "abc@gmail.com", (optional)
            "position": "Student", (optional)
            "roomNumber": "A-101", (optional)
            "profilePicture": "https://example.com/profile.jpg", (optional)
            "graduationYear": 2022, (optional)
            "isProfileComplete": true, (optional)
        }
    */

    // CSV upload format (for bulk update) (not implemented)
    /* 
        rollNumber,name,email,position,roomNumber,profilePicture,graduationYear,isProfileComplete,role
        18BCE0001,John Doe,abc@gmail.com,Student,A-101,https://example.com/profile.jpg,2022,true
    */
    


    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) {
      return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(req.url).searchParams;
    const rollNumber = params.get("rollNumber")?.toUpperCase().trim();

    const user = await User.findOne({rollNumber: rollNumber});

    if(!user) { return ERROR_RESPONSE("User not found", 404); }

    const data = await req.json();

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.position = data.position || user.position;
    user.roomNumber = data.roomNumber || user.roomNumber;
    user.profilePicture = data.profilePicture || user.profilePicture;
    user.graduationYear = data.graduationYear || user.graduationYear;
    user.isProfileComplete = data.isProfileComplete || user.isProfileComplete;
    user.role = data.role || user.role;

    await user.save();

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
}