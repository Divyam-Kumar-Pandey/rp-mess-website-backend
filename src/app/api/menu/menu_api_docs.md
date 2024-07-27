# RP Mess Menu APIs

## Get Mess Menu

Get the menu for the day and time slot. If `day` and `timeSlot` are not provided, it will return the whole menu.

### Request

- Method: GET
- Can be accessed by STUDENT, STAFF, ADMIN, SUPER ADMIN
- URL: `/api/menu`
- Headers:
  - Authorization: Bearer `<access_token>`
- Params:
  - `day` (optional): Accepts values `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`
  - `timeSlot` (optional): Accepts values `BREAKFAST`, `LUNCH`, `SNACKS`, `DINNER`

### Response

- Status: 200 OK
- Body:
  ````json
  {
    "success": true,
    "data": [
        {
            "_id": "667dc0e785ef0cf9c076bdcf",
            "day": "MONDAY",
            "timeSlot": "BREAKFAST",
            "name": "Masala Dosaaaa",
            "__v": 0
        },
        {
            "_id": "667dc6ab85ef0cf9c076bdd9",
            "day": "MONDAY",
            "timeSlot": "BREAKFAST",
            "name": "Dosa",
            "__v": 0,
            "imgURL": "bababa"
        },
        {
            "_id": "667dd1a985ef0cf9c076bdf1",
            "day": "TUESDAY",
            "timeSlot": "BREAKFAST",
            "name": "Masala Dosa",
            "__v": 0
        },
        {
            "_id": "667debb731fb5bba4ad7470d",
            "day": "TUESDAY",
            "timeSlot": "LUNCH",
            "name": "Roti",
            "__v": 0
        },
        {
            "_id": "667ec0f03351564a9a672e16",
            "day": "TUESDAY",
            "timeSlot": "DINNER",
            "name": "Paneer Masala",
            "__v": 0,
            "imgURL": "www.google.com"
        }
    ],
    "error": null
  }
    ```
  ````

## Add Menu Item

Add a new menu item.

### Request

- Method: POST
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/menu`
- Headers:
  - Authorization: Bearer `<access_token>`
- Body:
  ```json
  {
    "day": "MONDAY",                         (required)
    "timeSlot": "BREAKFAST",                 (required)
    "name": "Masala Dosa",                   (required)
    "imgURL": "https://www.imgurl.com/q.png" (optional)
  }
  ```

### Response

- Status: 200 Created
- Body:
  ```json
  {
    "success": true,
    "data": {
        "_id": "667dd1a985ef",
        "day": "MONDAY",
        "timeSlot": "BREAKFAST",
        "name": "Masala Dosa",
        "imgURL": "https://www.imgurl.com/q.png",
        "__v": 0
    },
    "error": null
  }
  ```

## Update Menu Item

Update an existing menu item.

### Request

- Method: PATCH
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/menu?id=<menu_item_id>`
- Headers:
  - Authorization: Bearer `<access_token>`
- Params:
  - `id`: The ID of the menu item to be updated (required)
- Body:
  ```json
  {
    "name": "Masala Dosa",                   (optional)
    "imgURL": "https://www.imgurl.com/q.png" (optional)
  }
  ```
  Both `name` and `imgURL` are optional. At least one of them should be provided.
  It won't update the `day` and `timeSlot` of the menu item.

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
        "_id": "667dd1a985ef",
        "day": "MONDAY",
        "timeSlot": "BREAKFAST",
        "name": "Masala Dosa",
        "imgURL": "https://www.imgurl.com/q.png",
        "__v": 0
    },
    "error": null
  }
  ```

## Delete Menu Item

Delete a menu item.

### Request

- Method: DELETE
- Can be accessed by ADMIN and SUPER ADMIN
- URL: `/api/menu?id=<menu_item_id>`
- Headers:
  - Authorization: Bearer `<access_token>`
- Params:
    - `id`: The ID of the menu item to be deleted (required)

### Response

- Status: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
        "_id": "667dd1a985ef",
        "day": "MONDAY",
        "timeSlot": "BREAKFAST",
        "name": "Masala Dosa",
        "imgURL": "https://www.imgurl.com/q.png",
        "__v": 0
    },
    "error": null
  }
  ```
  Deleted menu item will be returned in the response.
