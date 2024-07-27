# RP Mess User Refresh APIs

## Get New Access Token

Get a new access token using the refresh token.

### Request

- Method: POST
- Can be accessed by STUDENT, STAFF, ADMIN, SUPER ADMIN
- URL: `/api/user/refresh`
- Headers:
  - Authorization `Bearer <refresh_token>`

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
        "accessToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
        "refreshToken" : "eyJhbGci.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
    },
    "error": null
    }
    ```

    