import User from "@/lib/models/user";
import connect from "@/lib/db";
var jwt = require("jsonwebtoken");

function verifyAccessToken(token: string) {
  const secret = process.env.SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return {success: true, data: decoded};
  } catch (error) {
    return {success: false, error: error};
  }
}

export async function isAuthorizedAsAnyOfThem(token: string, checkFor: String[]) {
  // checkFor is an array of strings
  // if the user has any of the roles in checkFor, return true

  const result = verifyAccessToken(token);
  if (result.success) {
    try {
      await connect();
      if (result.data.tokenType !== "access") {
        return {success: false, error: "Invalid token type"};
      }
      const user = await User.findOne({rollNumber: result.data.rollNumber});
      // user role is an array of strings
      for (let i = 0; i < checkFor.length; i++) {
        if (user.role.includes(checkFor[i])) {
          return {success: true, data: result.data.rollNumber, error: null};
        }
      }
    } catch (error) {
      return {success: false, data: null,error: error};
    }

    return {success: false, data: null,error: null};
  } else {
    return {success: false, data: null,error: result.error};
  }
}

export const verifyTempToken = (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
    if (decoded.tokenType !== "temp") {
      return {success: false, data: null, error: "Unauthorized"};
    }
    return {success: true, data: decoded};
  } catch (error) {
    return {success: false, data: null, error: "Unauthorized"};
  }
};
