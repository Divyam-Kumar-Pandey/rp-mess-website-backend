# RP Mess Member APIs

## Get Member Details

Get the details of the member.

### Request

- Method: GET
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/member`
- Headers:
  - Authorization: Bearer `<access_token>`
- Params: `rollNumber` (optional): Accepts the roll number of the member

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "5f7b1b3b7f3b9b0017b3b1b3",
        "rollNumber": "18CE00015",
        "role": "STUDENT",
        "__v": 0
      }
    ],
    "error": null
  }
    ```


## Add Member

Add a new member or new members (using csv upload) to the mess.

### Request

- Method: POST
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/member`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
  ```json
  {
    "rollNumber": "18CE00015",
    "role": "STUDENT"
  }
  ```
  Content-Type: application/json (for single member)

    OR

  Content-Type: multipart/form-data (for multiple members)

    ```csv
    rollNumber,role
    18CE00015,STUDENT
    18CE00016,STUDENT
    18CE00017,STUDENT
    ```

    form-data:
    - file: `<csv_file>`

### Response

- Status: 200 OK

- Body:
  ```json
  {
    "success": true,
    "data": "Data inserted successfully",
    "error": null
  }
  ```

## Delete Member

Delete a member (or members) from the mess.

### Request

- Method: DELETE
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/member`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
  ```json
  {
    "rollNumber": "18CE00015"
  }
  ```
  Content-Type: application/json (for single member)

    OR
  
  Content-Type: multipart/form-data (for multiple members)

    ```csv
    rollNumber
    18CE00015
    18CE00016
    18CE00017
    ```
    form-data: `file: <csv_file>`

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": "Data deleted successfully",
    "error": null
  }
  ```


