# StayCare – Apartment / PG Complaint Management System

## 1. Project Description

StayCare is an Apartment and PG Complaint Management System developed
to help residents submit complaints and track their resolution.

Residents can submit complaints related to electricity, plumbing,
water supply, internet, housekeeping, maintenance and other issues.

The system provides REST APIs using Node.js and Express.js.

---

## 2. Features

- Submit complaints
- View complaints
- Search complaints
- Filter complaints
- View complaint details
- Edit complaints
- Delete complaints
- Update complaint status
- Priority management
- Input validation
- Error handling
- Responsive user interface

---

## 3. Technologies Used

### Frontend

- HTML
- CSS
- JavaScript
- DOM Manipulation
- Fetch API

### Backend

- Node.js
- Express.js
- REST API
- JSON

### Testing

- Postman

---

## 4. REST API Endpoints

### Get all complaints

GET

/api/complaints


### Get one complaint

GET

/api/complaints/:id


### Create complaint

POST

/api/complaints


### Update complaint

PUT

/api/complaints/:id


### Update status

PUT

/api/complaints/:id/status


### Delete complaint

DELETE

/api/complaints/:id

---

## 5. Installation

Clone the repository or download the project.

Open the project folder in VS Code.

Install dependencies:

npm install

Start the server:

node server.js

Open the browser:

http://localhost:3000

---

## 6. Project Structure

StayCare/

├── server.js

├── package.json

├── package-lock.json

└── public/

    ├── index.html

    ├── style.css

    └── script.js

---

## 7. API Testing

The REST APIs were tested using Postman.

The following operations were tested:

- GET
- POST
- PUT
- DELETE

---

## 8. Conclusion

StayCare provides a simple digital solution for managing apartment
and PG complaints. It demonstrates frontend development,
REST API concepts, CRUD operations, validation, error handling
and API testing.
