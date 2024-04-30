# Product Management API

Welcome to the Product Management API README file! This API is designed to provide seamless management of products through a RESTful interface. Whether you're creating, reading, updating, or deleting product data, this API powered by Node.js and Express has got you covered. With MongoDB integration, token-based authentication, and role-based authorization, managing your product data securely has never been easier.

## Features

- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on products effortlessly.
- **MongoDB Integration**: Seamlessly store and retrieve product data using MongoDB.
- **Token-Based Authentication**: Ensure secure access to the API endpoints with token-based authentication.
- **Role-Based Authorization**: Control access to different API functionalities based on user roles.

## Prerequisites

Before diving into using the API, make sure you have the following prerequisites:

- **Node.js**: Ensure Node.js is installed on your local machine.
- **MongoDB**: Have MongoDB installed and running locally or accessible via a MongoDB connection string.

## Installation

To get started, follow these simple installation steps:

1. **Clone the Repository**: 
    ```bash
    git clone <repository_url>
    cd product-management-api
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

## Configuration

Before running the server, you'll need to configure the MongoDB connection. Update the MongoDB connection string in `server.js` to point to your MongoDB database.

## Usage

To run the server, execute the following command:

```bash
node server.js
```

By default, the server will run on port 5000. You can customize the port by setting the `PORT` environment variable.

## Authentication

The API employs token-based authentication. To obtain an access token, send a POST request to `/login` with the following JSON payload:

```json
{
  "username": "admin",
  "password": "123"
}
```

Replace `"admin"` and `"adminpassword"` with your actual credentials. Upon successful authentication, you'll receive an access token in the response.

## Endpoints

- **GET /products**: Fetch all products.
- **POST /products**: Create a new product (requires admin role).
- **GET /products/:id**: Fetch a specific product by ID.
- **PUT /products/:id**: Update a product by ID (requires admin role).
- **DELETE /products/:id**: Delete a product by ID (requires admin role).

## Acknowledgments

This API wouldn't be possible without the following technologies:

- Express.js
- MongoDB
- Mongoose
- bcrypt
- jsonwebtoken

Feel free to explore, modify, and integrate this API into your projects. If you have any questions or feedback, don't hesitate to reach out. Happy coding! 🚀