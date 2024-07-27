# RP Mess User Register APIs

## Register User

Register a new user to the mess.

### Request

- Method: POST
- Can be accessed by STUDENT, STAFF, ADMIN, SUPER ADMIN
- URL: `/api/user/register`

- Body:
  ```json
  {
    "name": "John Doe",
    "rollNumber": "18CE00015",
    "email": "abc@gmail.com",
    "password": "password",
  }
    ```

### Response
- Status: 201 Created
- Body:
  ```json
  {
    "success": true,
    "data": {
        "user": {
            "id": "5f7b1b3b7f3b9b0017b3b1b3",
            "rollNumber": "18CE00015",
            "email": "abc@gmail.com",
            "role": ["STUDENT"],
        },
        "token" : {
            "accessToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
            "refreshToken" : "eyJhbGci.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
        }
    },
    "error": null
    }
```


