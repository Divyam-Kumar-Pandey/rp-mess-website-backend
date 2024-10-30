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
    const rollNumber = params.get("rollNumber")?.toUpperCase().trim();
    try {
        await connect();
        let hallMembers;
        if(rollNumber) hallMembers = await HallMember.find({rollNumber});
        else hallMembers = await HallMember.find();

        // put in an array
        hallMembers = hallMembers.map(hallMember => hallMember.toJSON());
        
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
            "role": "STUDENT",
            "email": "abc@gmail.com"
        }
        */
        if(!body.rollNumber || !body.role) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber, role", 400);
        }

        try {
            await connect();
            const hallMember = new HallMember({
                rollNumber: body.rollNumber.toUpperCase(), 
                role: body.role.toUpperCase(), 
                email: body.email
            });
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
        rollNumber,role,email
        123456789,STUDENT,abc@gmail.com
        123467890,STAFF,abc@gmail.com
        123478901,ADMIN,abc@gmail.com
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

        console.log(file);

        const reader = file.stream().getReader();
        let decoder = new TextDecoder();
        let result = await reader.read();
        let data = decoder.decode(result.value);
        let lines = data.split("\r\n");
        
        for(let i = 1; i < lines.length; i++) {
            let line = lines[i].split(",");
            let rollNumber = line[0]?.toUpperCase();
            let role = line[1]?.toUpperCase();
            let email = line[2];
            console.log(rollNumber, role, email);
            if(!rollNumber || !role) continue;
            const hallMember = new HallMember({rollNumber, role, email});
            // check if the rollNumber already exists in the database
            const existingHallMember = await HallMember.findOne
            ({rollNumber});
            if(existingHallMember) continue;
            await hallMember.save();
        }

        return SUCCESS_RESPONSE("Data inserted successfully", 200);

    } catch (error) {
        console.log(error);
        return ERROR_RESPONSE(error, 500);
    }
}

export async function DELETE(request: Request) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) { 
        return UNAUTHORISED_RESPONSE;
    }
    if(request.headers.get("Content-Type") == "application/json") {
        console.log("json");
        const body = await request.json();
        /* Sample Request Body
        {
            "rollNumber": "123456789"
        }
        */
        if(!body.rollNumber) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber", 400);
        }

        try {
            await connect();
            const hallMember = await HallMember.findOne({rollNumber: body.rollNumber.toUpperCase()});
            if(!hallMember) {
                return ERROR_RESPONSE("Hall Member not found", 400);
            }
            await hallMember.delete();
            return SUCCESS_RESPONSE("Hall Member deleted successfully", 200);
        } catch (error) {
            return ERROR_RESPONSE(error, 500);
        }
    }
    else {
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
        let deletedRollNumbers = [];
        try {
            await connect();
            for(let i = 1; i < lines.length; i++) {
                let line = lines[i].split(",");
                let rollNumber = line[0].toUpperCase();
                // console.log(rollNumber);
                if(!rollNumber) continue;
                const hallMember = await HallMember.deleteOne({ rollNumber });
                if(hallMember){
                    deletedRollNumbers.push(rollNumber);
                }
            }
        } catch (error) {
            return ERROR_RESPONSE(error, 500);
        }
        


        return SUCCESS_RESPONSE("Data deleted successfully", 200);
    }

}