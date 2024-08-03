import TempUser from "@/lib/models/tempUser";
import {verifyTempToken} from "@/lib/services/auth";
import User from "@/lib/models/user";
import connect from "@/lib/db";
import {ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE} from "@/app/constants";

export async function POST(request: Request): Promise<Response> {
  /* 
        Sample Request Body {
            "otp": "123456",
        }
  */
  const body = await request.json();
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return ERROR_RESPONSE("Unauthorized", 401);
  }

  // check if the token is valid
  let decoded = verifyTempToken(token).data;
  if (!decoded) { return UNAUTHORISED_RESPONSE; }

  //safety checks
  if (!body.otp) {
    return ERROR_RESPONSE("Invalid Request Body.", 400);
  }

  // check if the otp is valid
  try {
    await connect();
    const user = await TempUser.findOne({rollNumber: decoded.rollNumber});
    if (user.emailOTP !== body.otp) {
      return ERROR_RESPONSE("Invalid OTP", 400);
    }
    // save user in users collection
    const newUser = new User({
      rollNumber: user.rollNumber,
      password: user.password,
      email: user.email,
      name: user.name,
      role: user.role
    });
    await newUser.save();
    await TempUser.deleteOne({rollNumber: decoded.rollNumber});
    return SUCCESS_RESPONSE("User registered successfully", 200);
  } catch (error) {
    return ERROR_RESPONSE(error, 500);
  }
}
