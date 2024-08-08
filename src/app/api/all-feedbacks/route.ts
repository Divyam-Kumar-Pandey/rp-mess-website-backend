import { UNAUTHORISED_RESPONSE, SUCCESS_RESPONSE, ERROR_RESPONSE } from "@/app/constants";
import Feedback from "@/lib/models/feedback";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";
import connect from "@/lib/db";


export async function GET(req: Request): Promise<Response> {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN", "STAFF"]);
    if (!auth.success) { return UNAUTHORISED_RESPONSE; }

    const params = new URL(req.url).searchParams;
    // Enum: ['NOT_STARTED','PENDING', 'RESOLVED']
    const status = params.get("status");
    const limit = parseInt(params.get("limit") || "10");
    const page = parseInt(params.get("page") || "1");

    try{
        await connect();
        let feedbacks = await Feedback.find().sort({createdAt: -1}).skip((page - 1) * limit).limit(limit);
        if(status) feedbacks = feedbacks.filter(feedback => feedback.status === status);
        const feedbacksArray = feedbacks.map(feedback => {
            return {
                id: feedback._id,
                rollNumber: feedback.rollNumber,
                name: feedback.name,
                subject: feedback.subject,
                body: feedback.body,
                imgUrl: feedback.imgUrl,
                status: feedback.status,
                createdAt: feedback.createdAt,
            };
        });

        return SUCCESS_RESPONSE(feedbacksArray, 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}