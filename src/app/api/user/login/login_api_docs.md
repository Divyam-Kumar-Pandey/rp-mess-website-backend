# RP Mess User Login APIs

## Login User

Login a user to the mess.

### Request

- Method: POST
- Can be accessed by STUDENT, STAFF, ADMIN, SUPER ADMIN
- URL: `/api/user/login`
- Body:
  ```json
  {
    "rollNumber": "18CE00015",
    "password": "password",
  }
  ```

### Response

/*
    return Response.json({
        "success": true,
        "data": {
            'user': {
                'rollNumber': user.rollNumber,
                'name': user.name,
                'email': user.email,
                'isEmailVerified': user.isEmailVerified,
                'position': user.position,
                'roomNumber': user.roomNumber,
                'profilePicture': user.profilePicture,
                'graduationYear': user.graduationYear,
                'isProfileComplete': user.isProfileComplete,
            },
            'token' : generateTokens(user.rollNumber),

        },
        "error": null,
    });
*/

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
        "user": {
            "rollNumber": "18CE00015",
            "name": "John Doe",
            "email": "abc@gmail.com",
            "isEmailVerified": true,
            "position": "General Secretary",
            "roomNumber": "A-101",
            "profilePicture": "https://drive.google.com/uc?id=1",
            "graduationYear": 2022,
            "isProfileComplete": true,
        },
        "token" : {
            "accessToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
            "refreshToken" : "eyJhbGci.eyJyb2xlIjpbIlNVVEVSRU4iXSwiaWF0IjoxNjA0NzYwNjYzLCJleHAiOjE2MDQ3NjA3NjN9.1",
        }
    },
    "error": null
    }
    ```

    