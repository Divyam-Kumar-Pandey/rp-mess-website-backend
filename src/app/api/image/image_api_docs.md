# RP Mess Image API

## Upload Image to Drive

### Request

- Method: POST
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/image`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
    form-data:
    - image: `<image_file>`

    Content-Type: multipart/form-data

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
      "imgUrl": "https://drive.google.com/uc?id/1
    },
    "error": null
  }
  ```

