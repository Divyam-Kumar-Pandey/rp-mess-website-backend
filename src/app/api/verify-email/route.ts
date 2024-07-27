import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "@/app/constants";
import connect from "@/lib/db";
import User from "@/lib/models/user";
var nodemailer = require('nodemailer');

export async function POST(request: Request): Promise<Response> {
    /* 
        Sample Request Body {
            "rollNumber": "123456",
            "email": "dfsfsd@gmai.com",
        }
    */
    const body = await request.json();

    //safety checks
    if (!body.email || !body.rollNumber) {
        return ERROR_RESPONSE("Invalid Request Body. Required fields: email, rollNumber", 400);
    }
    
    // send verification email
    const email = body.email;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    await connect();

    // save verification code in db
    const user = await User.findOne({ rollNumber: body.rollNumber });
    user.verificationCode = verificationCode;
    await user.save();

    // send email

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: false,
    //     auth: {
    //         user: 'divyamkumarp@gmail.com',
    //         pass: ''
    //     }
    // });

    var mailOptions = {
      from: 'divyamkumarp@gmail.com',
      to: 'divyamkpandey23@kgpian.iitkgp.ac.in',
      subject: 'Sending Email using Node.js',
      text: 'That was easy! Your verification code is ' + verificationCode
    };

    // await transporter.sendMail(mailOptions, await function(error: any, info: any){
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    return SUCCESS_RESPONSE("Email sent successfully...", 200);

}