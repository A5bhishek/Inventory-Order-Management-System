# Inventory & Order Management System

A full-stack Inventory & Order Management System built using React, FastAPI, PostgreSQL, Docker, and Docker Compose.

## Features

### Product Management

* Create Product
* View Products
* Update Product
* Delete Product
* Unique SKU Validation
* Stock Quantity Validation

### Customer Management

* Create Customer
* View Customers
* Delete Customer
* Unique Email Validation

### Order Management

* Create Orders
* Multi-Product Orders
* View Orders
* Delete Orders
* Automatic Inventory Deduction
* Automatic Inventory Restoration on Order Deletion
* Automatic Total Amount Calculation
* Duplicate Product Validation

### Dashboard

* Total Products
* Total Customers
* Total Orders
* Total Revenue
* Inventory Alerts
* Recent Orders

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL

### DevOps

* Docker
* Docker Compose

### Deployment

* Render
* Vercel

---

## Live Deployment

### Frontend

https://inventory-order-management-system-e0zy119vc-a5bhisheks-projects.vercel.app/

### Backend

https://inventory-oms-backend.onrender.com/

### API Documentation

https://inventory-oms-backend.onrender.com/docs

### Docker Hub Image

https://hub.docker.com/r/abhishekk1509/inventory-backend

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd Inventory_Management_System
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_db
```

Run Backend

```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Docker Setup

Run entire application using Docker Compose:

```bash
docker compose up --build
```

Services:

* Frontend
* Backend
* PostgreSQL

---

## API Endpoints

### Products

* POST /products
* GET /products
* GET /products/{id}
* PUT /products/{id}
* DELETE /products/{id}

### Customers

* POST /customers
* GET /customers
* GET /customers/{id}
* DELETE /customers/{id}

### Orders

* POST /orders
* GET /orders
* GET /orders/{id}
* DELETE /orders/{id}

---

## Author

Abhishek Kumar
Software Engineer Assessment Project
