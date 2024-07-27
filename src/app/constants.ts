const ACCESS_TOKEN_EXPIRY = '1d'; // 1 day
const REFRESH_TOKEN_EXPIRY = '30d'; // 30 days

const UNAUTHORISED_RESPONSE = Response.json({
    "success": false,
    "data": null,
    "error": "Unauthorized",
}, { status: 401 });

const SUCCESS_RESPONSE = (data: any, statusCode: number) => Response.json({
    "success": true,
    "data": data,
    "error": null,
}, { status: statusCode });

const ERROR_RESPONSE = (error: any, statusCode: number) => Response.json({
    "success": false,
    "data": null,
    "error": error,
}, { status: statusCode });

const SALT_ROUNDS = 5;

export {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    UNAUTHORISED_RESPONSE,
    SUCCESS_RESPONSE,
    ERROR_RESPONSE,
    SALT_ROUNDS
};