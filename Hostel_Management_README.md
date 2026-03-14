# 🏨 Hostel Management System (MERN Stack)

A full-stack Hostel Management System built strictly using the MERN
Stack (MongoDB, Express.js, React.js, Node.js) with ShadCN UI + Framer
Motion for frontend styling and animations.

Tech Constraints Followed: - Only MERN Stack used - No extra
frameworks - Frontend uses ShadCN UI + Framer Motion - Custom manually
selected color palette (No AI-generated palettes)

## 📌 Tech Stack

### Frontend

-   React.js
-   ShadCN UI
-   Framer Motion
-   Axios
-   React Router DOM

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   Bcrypt (password hashing)

### Database

-   MongoDB Atlas / Local MongoDB

## 🎨 Frontend Design Rules

-   Clean hostel admin dashboard UI
-   ShadCN components used for Forms, Cards, Dialogs, Tables, Buttons
-   Framer Motion used for animations & page transitions
-   Custom color palette:
    -   Midnight Blue → Professional feel
    -   Beige → Soft background
    -   Brown → Stability & trust
    -   Red → Alerts & notices
    -   Gray → Neutral UI balance

## 👥 User Roles

1.  Admin
2.  Student
3.  Warden

## ✨ Core Features

### 🔐 Authentication System

-   Student Registration
-   Admin Login
-   JWT-based Authentication
-   Password Encryption
-   Role-based access control

## 🖥️ Frontend Features

### Dashboard

-   Total Students
-   Occupied Rooms
-   Vacant Rooms
-   Complaints count
-   Animated statistics

### Student Panel

-   Profile management
-   Room details view
-   Fee status
-   Submit complaints
-   Leave request form

### Admin Panel

-   Add/Edit/Delete students
-   Allocate rooms
-   Fee tracking
-   Complaint management
-   Attendance monitoring

### Room Management UI

-   Room listing table
-   Occupancy status
-   Filter by availability & floor

### Complaint Section

-   Submit complaint
-   View complaint status
-   Admin resolution panel

## ⚙️ Backend Features

### Student Management APIs

-   Add student
-   Update student details
-   Delete student
-   Get all students
-   Get single student profile

### Room Management APIs

-   Create room
-   Update room info
-   Assign student to room
-   Remove student from room
-   Fetch vacant rooms
-   Fetch occupied rooms

### Fee Management

-   Track fee payment status
-   Update payment records
-   Generate fee history

### Complaint Management

-   Raise complaint
-   View complaints
-   Admin resolve complaint
-   Complaint history

### Attendance System

-   Mark attendance
-   View attendance records
-   Monthly attendance summary

### Security Features

-   JWT token validation
-   Role-based route protection
-   Password hashing
-   Secure API routes

## 🗂️ Folder Structure

hostel-management/ │ ├── client/ │ ├── components/ │ ├── pages/ │ ├──
animations/ │ ├── ui/ │ └── App.js │ ├── server/ │ ├── controllers/ │
├── models/ │ ├── routes/ │ ├── middleware/ │ └── server.js │ └──
README.md

## 🚀 Installation Guide

### 1️⃣ Clone Repo

git clone https://github.com/yourusername/hostel-management.git cd
hostel-management

### 2️⃣ Backend Setup

cd server npm install npm start

### 3️⃣ Frontend Setup

cd client npm install npm run dev

## 🔑 Environment Variables (.env)

MONGO_URI= JWT_SECRET= PORT=5000

## 📊 Future Improvements

-   Online fee payment integration
-   QR-based attendance
-   Email notifications
-   Mobile responsive enhancement
-   Multi-hostel support
-   Visitor entry system

## 👨‍💻 Author

Manav Mittal\
CSE Student \| MERN Developer

## ⭐ Resume-Ready Description

Developed a full-stack Hostel Management System using the MERN stack
with secure authentication, room allocation, complaint tracking, and fee
management. Designed an interactive UI using ShadCN and Framer Motion
with a custom professional color palette.
