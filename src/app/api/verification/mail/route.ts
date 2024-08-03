import { ERROR_RESPONSE, SUCCESS_RESPONSE, UNAUTHORISED_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import { verificationMail } from "@/lib/services/verificationMail";
import TempUser from "@/lib/models/tempUser";
import { verifyTempToken } from "@/lib/services/auth";
var nodemailer = require('nodemailer');

export async function GET(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) { return UNAUTHORISED_RESPONSE; }

    // check if the token is valid
    let decoded = verifyTempToken(token).data;
    if (!decoded) { return UNAUTHORISED_RESPONSE; }

    
    // send verification email
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    await connect();
    
    // save verification code in db (in temp user)
    const user = await TempUser.findOne({ rollNumber: decoded.rollNumber });
    const email = user.email;
    user.emailOTP = verificationCode;
    await user.save();


    // send email

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'rpmess.app@gmail.com',
            pass: process.env.APP_PASSWORD
        }
    });

    var mailOptions = {
      from: 'rpmess.app@gmail.com',
      to: email,
      subject: 'Verification Code | RP Mess Website',
      html: verificationMail(verificationCode)
    };

    await transporter.sendMail(mailOptions, function(error: any, info: any){
      if (error) {
        console.log(error);
        return ERROR_RESPONSE("Error sending email", 500);
      } else {
        console.log('Email sent: ' + info.response);
        return SUCCESS_RESPONSE("Email sent successfully", 200);
      }
    });

    return SUCCESS_RESPONSE("Email sent successfully", 200);
}