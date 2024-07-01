import connect from "@/lib/db";
import HallMember from "@/lib/models/hallMember";

export async function GET(request: Request): Promise<Response> {
    const params = new URL(request.url).searchParams;
    const rollNumber = params.get("rollNumber");
    try {
        await connect();
        let hallMembers;
        if(rollNumber) hallMembers = await HallMember.find({rollNumber});
        else hallMembers = await HallMember.find();
        
        return Response.json({
            "success": true,
            "data": hallMembers,
            "error": null,
        });
    } catch (error) {
        return Response.json({
            "success": false,
            "data": null,
            "error": "Error connecting to MongoDB",
        });
    }
}

export async function POST(request: Request): Promise<Response> {
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
            return Response.json({
                "success": false,
                "data": null,
                "error": "Invalid Request Body",
            });
        }


        // check file extension
        if(!file || file.type !== "text/csv") {
            return Response.json({
                "success": false,
                "data": null,
                "error": "Invalid File Type. Please upload a CSV file",
            });
        }

        console.log(file);
        

        
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

        return Response.json({
            "success": true,
            "data": "Data inserted successfully",
            "error": null,
        });

    } catch (error) {
        return Response.json({
            "success": false,
            "data": null,
            "error": error,
        });
    }
}