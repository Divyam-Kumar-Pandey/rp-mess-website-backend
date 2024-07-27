API Docs:

- [Menu](./src/app/api/menu/menu_api_docs.md)
- [Noticeboard](./src/app/api/noticeboard/noticeboard_api_docs.md)
- [Register](./src/app/api/user/register/register_api_docs.md)
- [Login](./src/app/api/user/login/login_api_docs.md)
- [Refresh](./src/app/api/user/refresh/refresh_api_docs.md)
- [Member](./src/app/api/member/member_api_docs.md)
- [Image](./src/app/api/image/image_api_docs.md)
- [Reset Password](./src/app/api/user/reset-password/reset_password_api_docs.md)


Roles and Permissions:

- STUDENT: 
    - Can view the menu (GET) 
    - Can view mess staff
    - Can write feedback
    - Can view feedback (their own)
    - Can rate the food
    - Can view their rating
    - Can complete their profile (hold)
    - Can search for other students

- MESS STAFF:
    - Can view the menu
    - Can view all feedback (All the feedbacks) can be done.
    - Can view all ratings (How to compile the ratings???)
    - Can search for students (easy-peasy)
    - Can view all the students

- ADMIN:
    - Can view the menu
    - Can view feedback
    - Can view ratings
    - Can view mess staff
    - Can search for students
    - Can add/update/delete menu items
    - Can add/update/delete mess staff
    - Can add/delete hallMembers
    - Can view all feedback
    - Can view all ratings

- SUPER ADMIN:
    - Can do everything
    - Can add/delete admins
    - Can add/delete mess staff
    - Can add/delete hallMembers
    - Can view all feedback
    - Can view all ratings