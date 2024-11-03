import Rating from "@/lib/models/rating";
import connect from "@/lib/db";
import {ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE} from "@/app/constants";
import {isAuthorizedAsAnyOfThem} from "@/lib/services/auth";
import updateAvgRating from "@/lib/services/updateAvgRating";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return UNAUTHORISED_RESPONSE;
  }
  const auth = await isAuthorizedAsAnyOfThem(token, ["STUDENT", "STAFF", "ADMIN", "SUPERADMIN"]);
  const rollNumber = auth.data;
  const params = new URL(request.url).searchParams;
  const date = params.get("date");

  // check date format
  if (!date || !/^\d{2}-\d{2}-\d{4}$/.test(date) || new Date(date).toString() == "Invalid Date") {
    return ERROR_RESPONSE({message: "Invalid date format. Expected format: dd-mm-yyyy"}, 400);
  }

  try {
    await connect();
    const ratings = await Rating.find({rollNumber, date});
    // returns the ratings of the user for the given date
    return SUCCESS_RESPONSE(ratings, 200);
  } catch (error) {
    return ERROR_RESPONSE(error, 500);
  }
}

export async function POST(request: Request) {
  /*
        Sample request body:
        [
            {
                "rating": 3,          // rating should be between 0 and 5
                "timeSlot": "LUNCH",  // timeSlot should be one of BREAKFAST, LUNCH, SNACKS, DINNER
                "date": "04-08-2024" // date should be in dd-mm-yyyy format
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

  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return UNAUTHORISED_RESPONSE;
  }
  const auth = await isAuthorizedAsAnyOfThem(token, ["STUDENT", "STAFF", "ADMIN", "SUPERADMIN"]);
  const rollNumber = auth.data;
  const ratings = await request.json();

  // check if the request body is an array
  if (!Array.isArray(ratings)) {
    return ERROR_RESPONSE({message: "Request body should be an array"}, 400);
  }

  // check if the request body is empty
  if (ratings.length === 0) {
    return ERROR_RESPONSE({message: "Request body should not be empty"}, 400);
  }

  // check if the request body contains all the required fields
  for (const rating of ratings) {
    if (!rating.rating || !rating.timeSlot || !rating.date) {
      return ERROR_RESPONSE({message: "Request body should contain rating, timeSlot and date"}, 400);
    }
  }


  try {
    await connect();
    for (const rating of ratings) {
      const newRating = new Rating({
        rollNumber: rollNumber,
        rating: rating.rating,
        timeSlot: rating.timeSlot,
        date: rating.date
      });

      const existingRating = await Rating.findOne({rollNumber, timeSlot: rating.timeSlot, date: rating.date});

      if (existingRating) continue;

      await newRating.save();
    }

    // update the avgRating collection
    await updateAvgRating();

    return SUCCESS_RESPONSE({message: "Ratings added successfully"}, 200);
  } catch (error) {
    return ERROR_RESPONSE(error, 500);
  }
}
