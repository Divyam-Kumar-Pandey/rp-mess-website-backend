import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import Menu from "@/lib/models/menu";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ['STUDENT', 'STAFF', 'ADMIN', 'SUPERADMIN']);
    if (!auth.success) {
        return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(request.url).searchParams;
    const day = params.get("day");
    const timeSlot = params.get("timeSlot");
    try {
        await connect();
        const menu = await Menu.find();
        if (day || timeSlot) {
            let filteredMenu = menu;
            if(day) filteredMenu = filteredMenu.filter((item) => item.day === day);
            if(timeSlot) filteredMenu = filteredMenu.filter((item) => item.timeSlot === timeSlot);
            return SUCCESS_RESPONSE(filteredMenu, 200);
        }

        return SUCCESS_RESPONSE(menu, 200);
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

    try {
        await connect();

        /* 
        Sample Request Body {
        "day": "MONDAY",
        "imgURL": "https://www.google.com",
        "timeSlot": "MORNING",
        "name": "Dosa"
        }
        */

        const body = await request.json();

        //safety checks
        if (!body.day || !body.timeSlot || !body.name) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: day, timeSlot, name", 400);
        }


        const newMenu = new Menu(body);

        // check if the menu already exists
        const existingMenu = await Menu.findOne({ day: body.day, timeSlot: body.timeSlot, name: body.name });

        if (existingMenu) {
            return ERROR_RESPONSE(`Menu item with name '${body.name}' already exists for ${body.day} at ${body.timeSlot}.`, 400);
        }

        await newMenu.save();
        return SUCCESS_RESPONSE(newMenu, 201);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}

export async function PATCH(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) {
        return UNAUTHORISED_RESPONSE;
    }

    try {
        await connect();

        const params = new URL(request.url).searchParams;
        const id = params.get("id");

        if (!id) {
            return ERROR_RESPONSE("Invalid Request URL", 400);
        }

        const body = await request.json();

        // Safety checks
        if (!body.imgURL && !body.name) {
            return ERROR_RESPONSE("Invalid Request Body. Required fields: name or imgURL", 400);
        }

        const newName = body.name;
        const newImgURL = body.imgURL;

        const findItem = await Menu.findById(id);

        if (!findItem) {
            return ERROR_RESPONSE("Menu item not found.", 404);
        }

        // check if there is an entry with the same name on same timeSlot, and day
        const existingEntry = await Menu.findOne({
            day: findItem.day,
            timeSlot: findItem.timeSlot,
            name: newName,
        });

        if (existingEntry) {
            return ERROR_RESPONSE(`Menu item with name '${newName}' already exists for ${findItem.day} at ${findItem.timeSlot}.`, 400);
        }

        if(newName) findItem.name = newName;
        if(newImgURL) findItem.imgURL = newImgURL;

        await findItem.save();

        return SUCCESS_RESPONSE(findItem, 200);

    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}

export async function DELETE(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if (!auth.success) {
        return UNAUTHORISED_RESPONSE;
    }

    try {
        await connect();

        const params = new URL(request.url).searchParams;
        const id = params.get("id");

        if (!id) {
            return ERROR_RESPONSE("Invalid Request URL", 400);
        }

        const deletedMenu = await Menu.findByIdAndDelete(id);

        if (!deletedMenu) {
            return ERROR_RESPONSE("Menu item not found.", 404);
        }

        return SUCCESS_RESPONSE(deletedMenu, 200);

    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}