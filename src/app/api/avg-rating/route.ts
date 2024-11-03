import {UNAUTHORISED_RESPONSE, SUCCESS_RESPONSE, ERROR_RESPONSE} from "@/app/constants";
import AvgRating from "@/lib/models/avgRating";
import {isAuthorizedAsAnyOfThem} from "@/lib/services/auth";
import connect from "@/lib/db";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return UNAUTHORISED_RESPONSE;
  }
  const auth = await isAuthorizedAsAnyOfThem(token, ["ADMIN", "SUPERADMIN"]);
  const params = new URL(request.url).searchParams;
  const date = params.get("date");

  try {
    await connect();
    let ratings;
    if (date) ratings = await AvgRating.find({date});
    else ratings = await AvgRating.find();
    return SUCCESS_RESPONSE(ratings, 200);
  } catch (error) {
    return ERROR_RESPONSE(error, 500);
  }
}
