import Feedback from "@/lib/models/feedback";
import connect from "@/lib/db";
import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(req: Request): Promise<Response> {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN", "STUDENT", "STAFF"]);
    if (!auth.success) { return UNAUTHORISED_RESPONSE; }

    try{
        await connect();
        const feedbacks = await Feedback.find({rollNumber: auth.data}).sort({createdAt: -1});
        const feedbacksArray = feedbacks.map(feedback => feedback.toJSON());
        return SUCCESS_RESPONSE(feedbacksArray, 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}

export async function POST(req: Request): Promise<Response> {
    const feedbackData = await req.json();
    /* 
        Sample Request Body {
            "rollNumber": "123456",
            "subject": "Feedback Subject",
            "body": "Feedback Body",
            "imgUrl": "https://example.com/image.jpg"
        }
    */
    if (!feedbackData.rollNumber || !feedbackData.subject || !feedbackData.body) {
        return ERROR_RESPONSE("Invalid Request Body. Required fields: rollNumber, subject, body", 400);
    }

    const token = req.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN", "STUDENT", "STAFF"]);
    if (!auth.success) { return UNAUTHORISED_RESPONSE; }
    

    try{
        await connect();
        const feedback = new Feedback({
            rollNumber: feedbackData.rollNumber,
            subject: feedbackData.subject,
            body: feedbackData.body,
            imgUrl: feedbackData.imgUrl,
        });
        await feedback.save();
        return SUCCESS_RESPONSE(feedback, 200);
    } catch (error) {
        return ERROR_RESPONSE(error, 500);
    }
}


