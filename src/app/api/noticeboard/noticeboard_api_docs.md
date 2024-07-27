# RP Mess NoticeBoard APIs

## Get NoticeBoard

Get the notifications for the mess/hall.

### Request

- Method: GET
- Can be accessed by STUDENT, STAFF, ADMIN, SUPER ADMIN
- URL: `/api/noticeboard`
- Headers:
  - Authorization: Bearer `<access_token>`
- Params: `limit` (optional): Accepts the number of notifications to be fetched. Default is 100.

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
        {
            "_id": "5f7b1b3b7f3b9b0017b3b1b3",
            "title": "Notice 1",
            "body": "This is a notice",
            "imgUrl": "https://drive.google.com/uc?id/1",
            "createdAt": "2020-10-05T12:00:00.000Z",
            "__v": 0
        },
        {
            "_id": "5f7b1b3b7f3b9b0017b3b1b4",
            "title": "Notice 2",
            "body": "This is another notice",
            "imgUrl": "", // Empty string if no image
            "createdAt": "2020-10-05T12:00:00.000Z",
            "__v": 0
        }
    ],
    "error": null
  }
  ```

## Add Notice

Add a new notice to the mess/hall.
Can be accessed by ADMIN and SUPER ADMIN.

### Request

- Method: POST
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/noticeboard`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
  ```json
  {
    "title": "Notice 1",
    "body": "This is a notice",
    "imgUrl": "https://drive.google.com/uc?id=1" // Optional
  }
  ```

### Response

- Status: 200 Created
- Body:
  ```json
  {
    "success": true,
    "data": "Notification added successfully",
    "error": null
  }
  ```




