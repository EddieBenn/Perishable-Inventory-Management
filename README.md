# Perishable Inventory Management System

[Project-Url](https://perishable-inventory-management.onrender.com)

## Project Overview
The Perishable Inventory Management System is a stateless Node.js server built with TypeScript and Express, backed by a relational database. It efficiently tracks and manages perishable inventory by allowing users to add items with expiration timestamps, sell available inventory, and fetch non-expired quantities. The system optimizes inventory updates to prevent overselling and ensures expired records are periodically removed for database efficiency.

## Features
- **Item Management**: Add perishable items with quantity and expiration time.
- **Sales Processing**: Sell available inventory while preventing overselling.
- **Inventory Tracking**: Retrieve non-expired item quantities with validity timestamps.
- **Automated Cleanup**: Periodically removes expired inventory records.
- **High Concurrency Support**: Optimized for handling multiple requests efficiently.
- **Comprehensive Testing**: Ensures system reliability and correctness..


## Table of Contents
Installation<br />
Environment Variables<br />
Project Structure<br />
API Routes<br />
Inventory Routes<br />
Technologies Used<br />


## Installation
To install and run the project locally:

#### Clone the repository:

``` 
git clone https://github.com/EddieBenn/Perishable-Inventory-Managemen.git
```
#### Navigate into the project directory:

```
cd Perishable-Inventory-Management
```

#### Install dependencies:

```
npm install
```

#### Create a .env file in the root directory and add the necessary environment variables (see the Environment Variables section).


#### Build the project

```
npm run build
```


#### Start the development server:

```
npm run dev
```

# Environment Variables
Create a .env file in the root directory with the following variables:

```
# DEVELOPMENT KEYS
PORT = YOUR PORT
NODE_ENV = development
JWT_EXPIRY = YOUR JWT_EXPIRY
DATABASE_URL = YOUR DATABASE_URL
```


# Project Structure

```
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── validators
│   └── app.ts
├── tests
│   ├── inventory.test.ts
│   └── mockData.ts
├── .env.template
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── jest.config.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```


## API Routes
#### Inventory Routes

<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/:item/add</td>
      <td>Add a new lot of an item with quantity and expiration time</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/:item/sell</td>
      <td>Sell a specified quantity of an item, reducing its inventory</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/:item/quantity</td>
      <td>Retrieve the non-expired quantity of an item and its validity period</td>
    </tr>
  </tbody>
</table>


## Technologies Used

<ul>
<li>
Node.js - Runtime environment
</li>
<li>
Express.js - Web framework
</li>
<li>
TypeScript
</li>
<li>
PostgreSQL - Database
</li>
<li>
Sequelize - ORM for PostgreSQL
</li>
<li>
Winston (Logging library)
</li>
<li>
Jest - Testing framework
</li>
<li>
Zod - Schema validation
</li>
<li>
Node-cron - Task scheduling
</li>
<li>
ESLint - Code linting
</li>
<li>
Prettier - Code formatting
</li>
<li>
Helmet - Security middleware
</li>
<li>
Cookie-parser - Cookie parsing middleware
</li>
</ul>
