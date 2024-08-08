import { UNAUTHORISED_RESPONSE, SUCCESS_RESPONSE, ERROR_RESPONSE } from "@/app/constants";
import Feedback from "@/lib/models/feedback";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";
import connect from "@/lib/db";


export async function GET(req: Request): Promise<Response> {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN", "STAFF"]);
    if (!auth.success) { return UNAUTHORISED_RESPONSE; }

    try{
        await connect();
        const feedbacks = await Feedback.find().sort({createdAt: -1});
        const feedbacksArray = feedbacks.map(async (feedback) => {
            return {
                id: feedback._id,
                rollNumber: feedback.rollNumber,
                name: feedback.name,
                subject: feedback.subject,
                body: feedback.body,
                imgUrl: feedback.imgUrl,
                createdAt: feedback.createdAt,
            };
        });
        return SUCCESS_RESPONSE(feedbacksArray, 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}