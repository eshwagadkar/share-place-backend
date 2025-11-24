# Share Places -- Backend

A backend service built with **Node.js**, **Express**, and **MongoDB**,
providing APIs for creating, updating, deleting, and managing places
with secure user authentication and media upload handling.

> **Status:** 🚧 *Project is still in development and incrementally
> updated.*

------------------------------------------------------------------------

## 📌 Overview

This backend powers the **Share Places** application.

Key features include: - JWT-based user authentication
- Password hashing with bcrypt
- Protected routes & authorization
- CRUD for places
- File uploads (Multer)
- CORS setup
- MongoDB models & relations
- Google Geocoding API integration

------------------------------------------------------------------------

## 🔧 Docker & AWS Deployment

-   The backend is **fully dockerized**.
-   Pushed to **Docker Hub**:
    👉 **https://hub.docker.com/r/eshwagadkar/share-places**
-   Hosted on an **AWS EC2 Free Tier -- Amazon Linux 64-bit** instance.
-   The container runs successfully on EC2, but requires additional network and security configuration before it can be integrated in the live frontend. 👉 🔗 https://share-my-places-app-c02a1.web.app/auth
-   Therefore, the **frontend currently uses the Render-hosted backend
    URL**.   👉 **https://share-place-backend-i76p.onrender.com**

------------------------------------------------------------------------

## 📝 Development Timeline 

### 🔹 Latest Updates

-   Added authorization checks for updating & deleting places
-   Improved JWT middleware to allow `OPTIONS` requests

------------------------------------------------------------------------

### 🔐 Authentication & Security

-   JWT-based auth
-   Password hashing + comparison using bcrypt
-   Route protection middleware
-   Validation with express-validator
-   Unified error handling

------------------------------------------------------------------------

### 🗄 Database & Models

-   MongoDB models for Users & Places
-   Mongoose session-based transactions
-   User--Place relationships

------------------------------------------------------------------------

### 🖼 File Uploads

-   Multer configuration for image uploads
-   Static image serving route
-   Image deletion on place removal

------------------------------------------------------------------------

### 🌍 API Features

-   Signup, Login, Get Users
-   Create, Read, Update, Delete Places
-   Get places by place ID or user ID
-   Google Geocoding API integration

------------------------------------------------------------------------

### ⚙ Server Enhancements

-   Express server setup
-   CORS configuration updated
-   Refinements to routes, middleware, and error handling

------------------------------------------------------------------------

## 🧰 Tech Stack

  Feature             Technology
  ------------------- --------------------
  Backend             Node.js + Express
  Database            MongoDB + Mongoose
  Authentication      JWT
  Password Security   bcrypt
  File Uploads        Multer
  Validation          express-validator
  Geocoding           Google Maps API
  Deployment          Docker + AWS EC2 and Render (temporary)
  Registry            Docker Hub

------------------------------------------------------------------------

## 🚀 Current Status

Although the backend server is running in a Docker container on an EC2 instance, but additional network and security configuration is needed before the frontend can use the service exposed at the IPv4 public address - 13.232.248.131:4008

The frontend is temporarily configured to use the Render deployment at https://share-place-backend-i76p.onrender.com/api/v1/
This instance may experience cold starts due to Render’s inactivity timeout.

More updates coming soon... 🚧
