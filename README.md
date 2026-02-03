# 🛒 CampusQuick - Serverless Hyperlocal Delivery Platform

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-green?logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen)](https://d30albafirjxu4.cloudfront.net)

> A cloud-native grocery and essentials fulfillment platform designed for university campus environments, built with AWS serverless architecture. Partnered with **College Convenience** store for real-world deployment.

---

## 🚀 Live Demo

### 🌐 **Live Application:**
**https://d30albafirjxu4.cloudfront.net**

### 📡 **API Endpoints:**
| Endpoint | URL |
|----------|-----|
| Products | `https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/products` |
| Admin Orders | `https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/admin/orders` |

### 🔐 **Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@test.com` | `Test123!` |
| Admin | `admin@test.com` | `Admin123!` |
| Runner | `runner@test.com` | `Runner123!` |

---

## 🎯 Project Overview

CampusQuick solves the problem of urgent, short-distance delivery for campus convenience stores. Students can order essentials (snacks, beverages, toiletries, etc.) and receive them within **20-30 minutes** from nearby stores.

**Business Problem:** University convenience stores lack structured digital systems for fast, reliable hyperlocal delivery, leading to lost sales and poor customer experience.

**Solution:** A serverless cloud platform that enables small businesses to compete with large retailers through efficient order fulfillment workflows.

**Partner Store:** College Convenience (Open 24/7) - Northeastern University area

---

## 🏗️ Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   React     │    │   Amplify   │    │  CloudFront │         │
│  │   SPA       │───▶│   Auth      │───▶│   + S3      │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GET /products          POST /orders                      │  │
│  │  GET /orders/user/{id}  GET /orders/id/{id}              │  │
│  │  GET /admin/orders      PUT /admin/orders/{id}           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LAMBDA FUNCTIONS (6)                         │
│  GetProducts │ CreateOrder │ GetUserOrders │ GetOrderById       │
│  GetAllOrders │ UpdateOrderStatus                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DYNAMODB (3 Tables)                          │
│  Products (50 items) │ Orders (GSIs) │ Users                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITO USER POOL                             │
│         3 Groups: Customers │ Admins │ Runners                  │
└─────────────────────────────────────────────────────────────────┘
```

### AWS Services Utilized

| Service | Purpose | Implementation |
|---------|---------|----------------|
| **S3** | Static website hosting | React production build |
| **CloudFront** | CDN + HTTPS | Global edge caching, SSL/TLS |
| **API Gateway** | REST API management | 6 endpoints, CORS enabled |
| **Lambda** | Serverless compute | 6 Python 3.12 functions |
| **DynamoDB** | NoSQL database | 3 tables, 2 GSIs |
| **Cognito** | Authentication | User pool with 3 groups |
| **IAM** | Access control | Least-privilege roles |
| **CloudWatch** | Monitoring | Lambda execution logs |

---

## ✅ Features

### 🛍️ Customer Features
- **Hero Section** - Store branding with quick stats
- **Product Catalog** - Browse 50 products across 6 categories
- **Search Bar** - Real-time search by product name or description
- **Category Filters** - Filter by Beverages, Snacks, Health, Stationery, Personal Care, Electronics
- **Shopping Cart** - Add/remove items with quantity management
- **Checkout Flow** - Delivery address and special instructions
- **Order Confirmation** - Order details with estimated delivery time
- **My Orders** - Track orders with real-time status updates
- **Google Maps Integration** - Live delivery tracking with runner location

### 👔 Admin Features
- **Admin Dashboard** - View all orders with statistics
- **Order Management** - Filter and update order status
- **Status Workflow** - Progress orders through fulfillment

### 🚴 Runner Features
- **Runner Dashboard** - View available pickups
- **Delivery Management** - Accept, pick up, and deliver orders
- **Simulated GPS Tracking** - Demo mode for presentations
- **Route Visualization** - Google Maps integration

### 📦 Product Categories (50 Products)
| Category | Count | Examples |
|----------|-------|----------|
| 🥤 Beverages | 10 | Red Bull, Gatorade, Coffee, Cola |
| 🍕 Snacks & Food | 10 | Chips, Ramen, Granola Bars, Cookies |
| 💊 Health & Medicine | 8 | Tylenol, Band-Aids, Vitamins |
| 📚 Stationery | 8 | Notebooks, Pens, Highlighters |
| 🧴 Personal Care | 8 | Toothpaste, Shampoo, Sanitizer |
| 🔌 Electronics | 6 | Chargers, Cables, Batteries |

---

## 📁 Project Structure

```
CampasQuick-Cloud_Delivery/
├── frontend/                      # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js            # Login/Register
│   │   │   ├── Cart.js            # Shopping cart
│   │   │   ├── Checkout.js        # Checkout form
│   │   │   ├── OrderConfirmation.js
│   │   │   ├── AdminDashboard.js  # Admin panel
│   │   │   ├── RunnerDashboard.js # Runner panel
│   │   │   ├── MyOrders.js        # Order tracking
│   │   │   ├── OrderTrackingMap.js # Google Maps
│   │   │   └── SplashScreen.js    # Loading screen
│   │   ├── App.js                 # Main app with search/filters
│   │   ├── App.css                # Styling
│   │   ├── aws-config.js          # Cognito config
│   │   └── index.js
│   └── package.json
├── backend/
│   └── lambda/
│       ├── getProducts/
│       ├── createOrder/
│       ├── getUserOrders/
│       ├── getOrderById/
│       ├── getAllOrders/
│       └── updateOrderStatus/
├── docs/
│   ├── architecture/
│   └── progress-reports/
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| AWS Amplify v6 | Cognito authentication |
| Google Maps API | Delivery tracking |
| CSS3 | Custom styling |

### Backend
| Technology | Purpose |
|------------|---------|
| AWS Lambda | Python 3.12 serverless functions |
| API Gateway | REST API with CORS |
| DynamoDB | NoSQL database with GSIs |
| Cognito | User authentication |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| S3 | Static website hosting |
| CloudFront | CDN + HTTPS |
| IAM | Security roles |

---

## 📊 Database Schema

### Products Table (50 items)
```json
{
  "productId": "prod_001",
  "name": "Red Bull Energy Drink",
  "category": "Beverages",
  "price": 3.99,
  "stock": 50,
  "imageUrl": "https://images.unsplash.com/...",
  "description": "8.4 fl oz can - Wings when you need them"
}
```

### Orders Table
```json
{
  "orderId": "order_1738500000000",
  "customerId": "cognito-user-id",
  "items": [...],
  "subtotal": 15.98,
  "deliveryFee": 2.00,
  "total": 17.98,
  "deliveryAddress": "123 Dorm Hall",
  "status": "pending",
  "createdAt": 1738500000000
}
```

**Order Status Flow:**
```
pending → accepted → picking → out_for_delivery → delivered
```

**Global Secondary Indexes:**
- `customerId-index` - Query orders by customer
- `status-index` - Query orders by status

---

## 🔐 Security

| Feature | Implementation |
|---------|----------------|
| Authentication | AWS Cognito with JWT tokens |
| Authorization | Role-based (customers, admins, runners) |
| Encryption at Rest | DynamoDB encryption (AWS managed) |
| Encryption in Transit | HTTPS via CloudFront |
| CORS | Configured for frontend origin |
| IAM | Least-privilege Lambda roles |

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all 50 products |
| POST | `/orders` | Create new order |
| GET | `/orders/user/{userId}` | Get user's orders |
| GET | `/orders/id/{orderId}` | Get order by ID |
| GET | `/admin/orders` | Get all orders (admin) |
| PUT | `/admin/orders/{orderId}` | Update order status |

---

## 💰 Cost Analysis

### Current (Development)
| Service | Cost |
|---------|------|
| DynamoDB | $0.00 |
| Lambda | $0.00 |
| API Gateway | $0.00 |
| S3 + CloudFront | $0.00 |
| Cognito | $0.00 |
| **Total** | **$0.00** |

### Projected (1,000 orders/month)
| Service | Cost |
|---------|------|
| All Services | ~$4.80/month |
| **Per Order** | **$0.0048** |

---

## 🧪 Quick Test

```bash
# Get all products
curl https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/products

# Response
{
  "success": true,
  "count": 50,
  "products": [...]
}
```

---

## 📈 AWS Well-Architected Framework

| Pillar | Implementation |
|--------|----------------|
| **Operational Excellence** | CloudWatch monitoring, GitHub version control |
| **Security** | Cognito auth, IAM roles, encryption, HTTPS |
| **Reliability** | Multi-AZ DynamoDB, Lambda auto-retry |
| **Performance** | CloudFront CDN, DynamoDB on-demand |
| **Cost Optimization** | Serverless pay-per-use, free tier |

---

## 👨‍💻 Author

**Sumukh Pitre**  
Northeastern University - MS in Informatics

| Contact | Link |
|---------|------|
| 📧 Email | pitre.s@northeastern.edu |
| 💼 LinkedIn | [linkedin.com/in/sumukhpitre](https://linkedin.com/in/sumukhpitre) |
| 🐙 GitHub | [github.com/SBitre](https://github.com/SBitre) |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>🛒 CampusQuick - Cloud-Powered Campus Convenience</b><br>
  <i>Delivering essentials to your dorm in 20-30 minutes</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Products-50-blue" />
  <img src="https://img.shields.io/badge/Lambda-6%20Functions-orange" />
  <img src="https://img.shields.io/badge/DynamoDB-3%20Tables-green" />
  <img src="https://img.shields.io/badge/Cognito-3%20Roles-purple" />
</p>

---

**Status:** 🟢 Live in Production  
**Live URL:** https://d30albafirjxu4.cloudfront.net  
**Demo Date:** February 9, 2025

---

*Last Updated: February 2, 2025*