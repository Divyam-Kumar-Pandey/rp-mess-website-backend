import connect from "@/lib/db";
import Menu from "@/lib/models/menu";

export async function GET(request: Request): Promise<Response> {
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
            return Response.json({
                "success": true,
                "data": filteredMenu,
                "error": null,
            });
        }

        return Response.json({
            "success": true,
            "data": menu,
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
            return Response.json({
                "success": false,
                "data": null,
                "error": "Invalid Request Body",
            });
        }


        const newMenu = new Menu(body);

        // check if the menu already exists
        const existingMenu = await Menu.findOne({ day: body.day, timeSlot: body.timeSlot, name: body.name });

        if (existingMenu) {
            return Response.json({
                "success": false,
                "data": null,
                "error": "Menu already exists",
            });
        }

        await newMenu.save();
        return Response.json({
            "success": true,
            "data": newMenu,
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

export async function PATCH(request: Request): Promise<Response> {
    try {
        await connect();

        const params = new URL(request.url).searchParams;
        const id = params.get("id");

        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                data: null,
                error: "Invalid Request URL",
            }), { status: 400 });
        }

        const body = await request.json();

        // Safety checks
        if (!body.imgURL && !body.name) {
            return new Response(JSON.stringify({
                success: false,
                data: null,
                error: "Invalid Request Body - No fields to update.",
            }), { status: 400 });
        }

        const newName = body.name;
        const newImgURL = body.imgURL;

        const findItem = await Menu.findById(id);

        if (!findItem) {
            return new Response(JSON.stringify({
                success: false,
                data: null,
                error: "Menu not found",
            }), { status: 404 });
        }

        // check if there is an entry with the same name on same timeSlot, and day
        const existingEntry = await Menu.findOne({
            day: findItem.day,
            timeSlot: findItem.timeSlot,
            name: newName,
        });

        if (existingEntry) {
            return new Response(JSON.stringify({
                success: false,
                data: null,
                error: `Menu item with name '${newName}' already exists for ${findItem.day} at ${findItem.timeSlot}.`,
            }), { status: 400 });
        }

        if(newName) findItem.name = newName;
        if(newImgURL) findItem.imgURL = newImgURL;

        await findItem.save();

        return new Response(JSON.stringify({
            success: true,
            data: findItem,
            error: null,
        }), { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            data: null,
            error: error,
        }, { status: 500 });
    }
}

export async function DELETE(request: Request): Promise<Response> {
    try {
        await connect();

        const params = new URL(request.url).searchParams;
        const id = params.get("id");

        if (!id) {
            return Response.json({
                success: false,
                data: null,
                error: "Invalid Request URL",
            }, { status: 400 });
        }

        const deletedMenu = await Menu.findByIdAndDelete(id);

        if (!deletedMenu) {
            return Response.json({
                success: false,
                data: null,
                error: "Delete failed. Menu not found.",
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            data: deletedMenu,
            error: null,
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            data: null,
            error: error,
        }, { status: 500 });
    }
}