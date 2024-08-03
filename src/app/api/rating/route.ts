import Rating from "@/lib/models/rating";
import connect from "@/lib/db";
import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import { isAuthorizedAsAnyOfThem } from "@/lib/services/auth";

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) { return UNAUTHORISED_RESPONSE; }
    const auth = await isAuthorizedAsAnyOfThem(token, ['STUDENT', 'STAFF', 'ADMIN', 'SUPERADMIN']);
    const rollNumber = auth.data;
    const params = new URL(request.url).searchParams;
    const date = params.get('date');
    

    try{
        await connect();
        const ratings = await Rating.find({ rollNumber, date });
        return SUCCESS_RESPONSE(ratings, 200);
    }
    catch(error){
        return ERROR_RESPONSE(error, 500);
    }
}

export async function POST(request: Request) {

    /*
        Sample request body:
        [
            {
                "rating": 3,
                "timeSlot": "LUNCH",
                "date": "04-08-2024"
            },
            {
                "rating": 4,
                "timeSlot": "SNACKS",
                "date": "04-08-2024"
            },
            {
                "rating": 2,
                "timeSlot": "DINNER",
                "date": "04-08-2024"
            }
        ]   
    */

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) { return UNAUTHORISED_RESPONSE; }
    const auth = await isAuthorizedAsAnyOfThem(token, ['STUDENT', 'STAFF', 'ADMIN', 'SUPERADMIN']);
    const rollNumber = auth.data;
    const ratings = await request.json();

    try{
        await connect();
        for (const rating of ratings){
            const newRating = new Rating({
                rollNumber: rollNumber,
                rating: rating.rating,
                timeSlot: rating.timeSlot,
                date: rating.date,
            });

            const existingRating = await Rating.findOne({ rollNumber, timeSlot: rating.timeSlot, date: rating.date });

            if(existingRating) continue;

            await newRating.save();
        }

        return SUCCESS_RESPONSE({ message: "Ratings added successfully" }, 200);
    }
    catch(error){
        return ERROR_RESPONSE(error, 500);
    }
}