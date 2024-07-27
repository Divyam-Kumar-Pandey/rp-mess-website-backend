import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";
import Notification from "@/lib/models/notification";


export async function GET(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ['STUDENT', 'STAFF', 'ADMIN', 'SUPERADMIN']);
    if (!auth.success) {
        return UNAUTHORISED_RESPONSE;
    }

    const params = new URL(request.url).searchParams;
    const limit = parseInt(params.get("limit")??'100');

    try {
        await connect();
        const notifications = await Notification.find().sort({createdAt: -1}).limit(limit);
        return SUCCESS_RESPONSE(notifications, 200);
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

    const body = await request.json();
    /* Sample Request Body
    {
        "title": "New Notification",
        "body": "This is a new notification",
        "imgURL": "https://www.google.com", // Optional
    }
    */
    if(!body.title || !body.body) {
        return ERROR_RESPONSE("Invalid Request Body. Required fields: title, body", 400);
    }
    try {
        await connect();
        const notification = new Notification({title: body.title, body: body.body, imgURL: (body.imgURL)??''});
        await notification.save();
        return SUCCESS_RESPONSE("Notification added successfully", 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
    
}