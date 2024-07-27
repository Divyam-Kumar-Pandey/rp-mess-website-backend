import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import HallMember from "@/lib/models/hallMember";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) { 
        return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(request.url).searchParams;
    const rollNumber = params.get("rollNumber");
    try {
        await connect();
        let hallMembers;
        if(rollNumber) hallMembers = await HallMember.find({rollNumber});
        else hallMembers = await HallMember.find();
        
        return SUCCESS_RESPONSE(hallMembers, 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}

export async function POST(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) { 
        return UNAUTHORISED_RESPONSE;
    }

    if(request.headers.get("Content-Type") == "application/json") {
        const body = await request.json();
        /* Sample Request Body
        {
            "rollNumber": "123456789",
            "role": "STUDENT"
        }
        */
        if(!body.rollNumber || !body.role) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber, role", 400);
        }

        try {
            await connect();
            const hallMember = new HallMember({rollNumber: body.rollNumber, role: body.role});
            const existingHallMember = await HallMember.findOne({rollNumber: body.rollNumber});
            if(existingHallMember) {
                return ERROR_RESPONSE("Hall Member already exists", 400);
            }
            await hallMember.save();
            return SUCCESS_RESPONSE("Hall Member added successfully", 200);
        } catch (error) {
            return ERROR_RESPONSE(error, 500);
        }
    }

    try {
        await connect();

        /* 
        we will upload a csv file with 'rollNumber', and 'role' columns and then we will parse the csv file and insert the data into the database
        format of csv file:
        rollNumber,role
        123456789,STUDENT
        123467890,STAFF
        123478901,ADMIN
        ...

        formData.append("file", file);
        */

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if(!file) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: file", 400);
        }


        // check file extension
        if(!file || file.type !== "text/csv") {
            return ERROR_RESPONSE("Invalid file type. Required file type: text/csv", 400);
        }

        const reader = file.stream().getReader();
        let decoder = new TextDecoder();
        let result = await reader.read();
        let data = decoder.decode(result.value);
        let lines = data.split("\r\n");
        
        for(let i = 1; i < lines.length; i++) {
            let line = lines[i].split(",");
            let rollNumber = line[0];
            let role = line[1];
            if(!rollNumber || !role) continue;
            const hallMember = new HallMember({rollNumber, role});
            // check if the rollNumber already exists in the database
            const existingHallMember = await HallMember.findOne
            ({rollNumber});
            if(existingHallMember) continue;
            await hallMember.save();
        }

        return SUCCESS_RESPONSE("Data inserted successfully", 200);

    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}