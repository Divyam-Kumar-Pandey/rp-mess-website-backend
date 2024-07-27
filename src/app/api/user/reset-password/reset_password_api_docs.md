# RP Mess User Reset Password APIs

## Reset Password

Reset the password of the user.

### Request

- Method: POST
- Can be accessed by ADMIN, SUPER ADMIN
- URL: `/api/user/reset-password`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
  ```json
  {
    "rollNumber": "18CE00015",
    "newPassword": "password",
  }
  ```

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": "Password reset successfully",
    "error": null
    }
  ```
