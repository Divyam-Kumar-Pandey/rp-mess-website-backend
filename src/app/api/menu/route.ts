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

        const body = await request.json();

        // Safety checks
        if (!body.day || !body.timeSlot || !body.name) {
            return new Response(JSON.stringify({
                success: false,
                data: null,
                error: "Invalid Request Body",
            }), { status: 400 });
        }

        const newName = body?.newName || body.name;

        // Check if an entry with the same name, day, and timeSlot already exists
        if (body.name !== newName) {
            const existingEntry = await Menu.findOne({
                day: body.day,
                timeSlot: body.timeSlot,
                name: newName,
            });

            if (existingEntry) {
                return Response.json({
                    success: false,
                    data: null,
                    error: `Menu with name '${newName}' already exists for ${body.day} at ${body.timeSlot}.`,
                }, { status: 400 });
            }
        }
        let toBeUpdated: { [key: string]: string } = {
            name: newName,
        };
        if (body.imgURL) {
            toBeUpdated.imgURL = body.imgURL;
        }

        // Update the entry if no duplicate is found
        const updatedMenu = await Menu.findOneAndUpdate(
            {
                day: body.day,
                timeSlot: body.timeSlot,
                name: body.name,
            },
            toBeUpdated,
            { new: true }
        );

        if (!updatedMenu) {
            return Response.json({
                success: false,
                data: null,
                error: "Update failed. Menu not found.",
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            data: updatedMenu,
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

export async function DELETE(request: Request): Promise<Response> {
    try {
        await connect();

        const body = await request.json();

        // Safety checks
        if (!body.day || !body.timeSlot || !body.name) {
            return Response.json({
                success: false,
                data: null,
                error: "Invalid Request Body",
            }, { status: 400 });
        }

        const deletedMenu = await Menu.findOneAndDelete({
            day: body.day,
            timeSlot: body.timeSlot,
            name: body.name,
        });

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