# E-commerce REST API with Node.js  

## Overview  
This project is a **scalable E-commerce REST API** built using **Node.js**. It provides core features for an online shopping platform, including **authentication**, **authorization**, and various role-based functionalities for users, sellers, and admins.  

---

## Features  

### 1. **Authentication System**  
- Secure user login and registration for **users**, **sellers**, and **admins**.  
- Token-based authentication (JWT).  

### 2. **Authorization System**  
- Restricts access to routes based on user roles.  
- Ensures each role (user, seller, admin) can only access permitted functionality.  

### 3. **Seller Functionalities**  
- Sellers can manage their own products:  
  - **Add new products** with details like price, image, category, and description, etc.  
  - Edit and delete their products.  

### 4. **User Functionalities**  
- **View All Products**:  
  - Filter products by attributes such as price, category, subcategory, etc.  
- **Cart Management**:  
  - Add products to the cart.  
  - Apply coupons to receive discounts on the cart total.  
- **Order Management**:  
  - Create orders and choose a specific shipping address from their address list.  
- **Wishlist Management**:  
  - Add products to a personal wishlist for future reference.  
- **Review Management**:  
  - Add reviews to products, enabling feedback and ratings.  
- **Address Management**:  
  - Add multiple addresses to use during checkout.  

### 5. **Admin Functionalities**  
- **Track System Processes**:  
  - Monitor and manage users and sellers.  
  - View and analyze activity logs.
- **Category, Subecategory and Brand Management**:  
  - Add and manage **categories**, **subcategories**, and **brands** to enable sellers to add products under predefined options.  
- **Coupon Management**:  
  - Create and manage coupons to offer discounts to users.  

---

## Technologies Used  
- **Backend Framework**: Node.js  
- **Database**: MongoDB (with Mongoose)  
- **Authentication**: JSON Web Tokens (JWT)  
- **Validation**: express-validator  
- **Routing and Middleware**: Express.js  
- **Cloud Storage (optional)**: Cloudinary for images  

---


