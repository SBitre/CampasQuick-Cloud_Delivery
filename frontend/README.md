# 🛒 CampusQuick - Serverless Hyperlocal Delivery Platform

![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Python](https://img.shields.io/badge/Python-3.12-green?logo=python)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-In%20Development-brightgreen)

A cloud-native grocery and essentials fulfillment platform designed for university campus environments, built with AWS serverless architecture. Partnered with **College Convenience** store for real-world deployment.

---

## 🚀 Live Demo

**API Endpoint (Products):**
```
https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/products
```

**API Endpoint (Admin Orders):**
```
https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/admin/orders
```

*Try it in your browser! Returns JSON data.* ✨

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
│                     LAMBDA FUNCTIONS                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ GetProducts│ │CreateOrder │ │GetUserOrder│ │GetOrderById│   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│  ┌────────────┐ ┌────────────┐                                  │
│  │GetAllOrders│ │UpdateStatus│                                  │
│  └────────────┘ └────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DYNAMODB                                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │  Products  │ │   Orders   │ │   Users    │                  │
│  │  Table     │ │   Table    │ │   Table    │                  │
│  │  (15 items)│ │  (2 GSIs)  │ │            │                  │
│  └────────────┘ └────────────┘ └────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITO USER POOL                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Customers  │ │   Admins   │ │  Runners   │                  │
│  │   Group    │ │   Group    │ │   Group    │                  │
│  └────────────┘ └────────────┘ └────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### AWS Services Used

| Service | Purpose | Why This Choice |
|---------|---------|-----------------|
| **S3** | Static website hosting for React app | Cost-effective, highly available |
| **CloudFront** | CDN for global content delivery | Faster load times, HTTPS/SSL |
| **API Gateway** | RESTful API management | Managed service, built-in throttling |
| **Lambda** | Serverless backend functions (6 functions) | Auto-scaling, pay-per-use |
| **DynamoDB** | NoSQL database (3 tables) | Serverless, millisecond latency |
| **Cognito** | User authentication & authorization | Managed auth, JWT tokens, user groups |
| **CloudWatch** | Logging and monitoring | Centralized observability |
| **IAM** | Security and access control | Least-privilege permissions |

**Total Estimated Monthly Cost:** ~$4.80 for 1000 orders/month

---

## ✅ Features Implemented

### Customer Features
- ✅ **Splash Screen** - Branded loading screen with AWS services showcase
- ✅ **User Authentication** - Sign up, sign in with Cognito
- ✅ **Product Catalog** - Browse 15 products across 6 categories
- ✅ **Shopping Cart** - Add/remove items, quantity management, localStorage persistence
- ✅ **Checkout Flow** - Delivery address, instructions, order submission
- ✅ **Order Confirmation** - Order ID, status, delivery estimate

### Admin Features
- ✅ **Admin Dashboard** - View all orders with stats
- ✅ **Order Filtering** - Filter by status (Pending, Accepted, Picking, etc.)
- ✅ **Status Updates** - Progress orders through fulfillment workflow
- ✅ **Order Statistics** - Total, Pending, In Progress, Delivered counts

### Technical Features
- ✅ **Role-Based Access** - Customer, Admin, Runner user groups
- ✅ **RESTful API** - 6 endpoints with full CRUD operations
- ✅ **CORS Enabled** - Frontend-backend communication
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **College Convenience Theme** - Custom green & white branding

---

## 📁 Project Structure

```
CampasQuick-Cloud_Delivery/
├── frontend/                    # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js          # Login/Register component
│   │   │   ├── Auth.css
│   │   │   ├── Cart.js          # Shopping cart
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.js      # Checkout form
│   │   │   ├── Checkout.css
│   │   │   ├── OrderConfirmation.js
│   │   │   ├── OrderConfirmation.css
│   │   │   ├── AdminDashboard.js # Admin order management
│   │   │   ├── AdminDashboard.css
│   │   │   ├── SplashScreen.js  # Branded splash screen
│   │   │   └── SplashScreen.css
│   │   ├── App.js               # Main application
│   │   ├── App.css              # Global styles (green theme)
│   │   ├── aws-config.js        # Cognito configuration
│   │   └── index.js
│   └── package.json
├── backend/
│   └── lambda/
│       ├── getProducts/         # GET /products
│       ├── createOrder/         # POST /orders
│       ├── getUserOrders/       # GET /orders/user/{userId}
│       ├── getOrderById/        # GET /orders/id/{orderId}
│       ├── getAllOrders/        # GET /admin/orders
│       └── updateOrderStatus/   # PUT /admin/orders/{orderId}
├── infrastructure/
│   └── terraform/               # Infrastructure as Code (future)
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
- **React 18** - UI framework
- **AWS Amplify v6** - Cognito authentication
- **CSS3** - Custom styling (College Convenience green theme)
- **localStorage** - Cart persistence

### Backend
- **AWS Lambda** - Python 3.12 (6 functions)
- **API Gateway** - REST API with CORS
- **DynamoDB** - NoSQL database (3 tables, 2 GSIs)
- **Cognito** - User pools with 3 groups

### Development Tools
- **VS Code** - IDE
- **Postman** - API testing
- **AWS Console** - Cloud management
- **Git/GitHub** - Version control

---

## 📊 Data Model

### Products Table
```json
{
  "productId": "prod_001",
  "name": "Red Bull Energy Drink",
  "category": "beverages",
  "price": 3.99,
  "stock": 50,
  "imageUrl": "https://...",
  "description": "8.4 fl oz can, sugar-free available"
}
```
**Current Data:** 15 products across 6 categories

### Orders Table
```json
{
  "orderId": "order_1769020870704",
  "customerId": "94d80458-8051-7099-a1d9-63c54bb62a08",
  "items": [
    {"productId": "prod_015", "name": "Gatorade", "quantity": 2, "price": 2.29}
  ],
  "subtotal": 21.06,
  "deliveryFee": 2.00,
  "total": 23.06,
  "deliveryAddress": "123 dorm hall",
  "status": "delivered",
  "createdAt": 1769020870704
}
```

**Status Flow:**
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
| **Authentication** | AWS Cognito with JWT tokens |
| **Authorization** | Role-based (customers, admins, runners groups) |
| **Data Encryption** | DynamoDB encryption at rest (AWS managed) |
| **Transport Security** | HTTPS enforced via API Gateway |
| **CORS** | Configured for frontend origin |
| **IAM** | Least-privilege Lambda execution roles |

---

## 🚀 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | List all products | No |
| POST | `/orders` | Create new order | Yes |
| GET | `/orders/user/{userId}` | Get user's orders | Yes |
| GET | `/orders/id/{orderId}` | Get order by ID | Yes |
| GET | `/admin/orders` | Get all orders (admin) | Admin |
| PUT | `/admin/orders/{orderId}` | Update order status | Admin |

---

## 🧪 Testing

### Test Products API
```bash
curl https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/products
```

### Test Admin Orders API
```bash
curl https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/admin/orders
```

### Test Order Status Update
```bash
curl -X PUT \
  https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod/admin/orders/order_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

---

## 📈 Development Progress

### Completed (Days 1-15) ✅

| Day | Task | Status |
|-----|------|--------|
| 1-2 | Project planning, architecture design | ✅ |
| 3 | GitHub setup, React initialization | ✅ |
| 4 | DynamoDB tables (3), sample data (15 products) | ✅ |
| 5 | GetProducts Lambda + API Gateway | ✅ |
| 6 | CreateOrder Lambda with validation | ✅ |
| 7 | GetUserOrders + GetOrderById Lambdas | ✅ |
| 8 | React product catalog + cart UI | ✅ |
| 9 | Checkout flow + order submission | ✅ |
| 10 | Order confirmation + UI polish | ✅ |
| 11-12 | Cognito authentication setup | ✅ |
| 13 | Admin Dashboard + GetAllOrders Lambda | ✅ |
| 14 | UpdateOrderStatus Lambda | ✅ |
| 15 | Splash screen + green theme styling | ✅ |

### Remaining (Days 16-28)

| Day | Task | Status |
|-----|------|--------|
| 16-18 | Runner interface, order tracking | 🔄 |
| 19-20 | S3 + CloudFront deployment | 🔄 |
| 21-23 | CloudWatch monitoring, testing | 🔄 |
| 24-25 | Progress report, documentation | 🔄 |
| 26-28 | Final testing, demo prep | 🔄 |

---

## 💰 Cost Analysis

### Current (Development)
| Service | Usage | Cost |
|---------|-------|------|
| DynamoDB | 15 items, ~100 requests | $0.00 |
| Lambda | ~50 invocations | $0.00 |
| API Gateway | ~100 requests | $0.00 |
| Cognito | 3 users | $0.00 |
| **Total** | | **$0.00** |

### Projected (1000 orders/month)
| Service | Estimated Cost |
|---------|----------------|
| DynamoDB | $1.50 |
| Lambda | $0.50 |
| API Gateway | $1.00 |
| S3 + CloudFront | $1.00 |
| Cognito | $0.50 |
| **Total** | **~$4.80/month** |

---

## 🎓 Learning Objectives Demonstrated

- ☁️ **Cloud-Native Architecture** - Serverless design patterns
- 🔧 **AWS Services** - Hands-on with 8+ AWS services
- 🌐 **API Design** - RESTful API best practices
- 🔐 **Security** - IAM roles, Cognito authentication, CORS
- 💵 **Cost Optimization** - Pay-per-use pricing model
- 📈 **Scalability** - Auto-scaling serverless infrastructure
- 📝 **DevOps** - Version control, documentation
- 💼 **Business Analysis** - IT solutions for real-world problems

---

## 👨‍💻 Author

**Sumukh Pitre**  
Northeastern University - MS in Informatics (Cloud Concentration)

- 📧 Email: pitre.s@northeastern.edu
- 💼 LinkedIn: [linkedin.com/in/sumukhpitre](https://linkedin.com/in/sumukhpitre)
- 🐙 GitHub: [github.com/SBitre](https://github.com/SBitre)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Course:** ITC 6420 - Introduction to Cloud Computing, Northeastern University
- **Partner:** College Convenience Store (Northeastern University area)
- **Technologies:** AWS Serverless Services
- **Framework:** AWS Well-Architected Framework principles

---

<p align="center">
  <b>🛒 CampusQuick - Cloud-Powered Campus Convenience</b><br>
  <i>Delivering essentials to your dorm in 20-30 minutes</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Lambda-6%20Functions-orange?logo=aws-lambda" />
  <img src="https://img.shields.io/badge/DynamoDB-3%20Tables-blue?logo=amazon-dynamodb" />
  <img src="https://img.shields.io/badge/Cognito-3%20User%20Groups-green?logo=amazon-aws" />
</p>

---

**Status:** 🚧 In Active Development  
**Progress:** 54% Complete (15/28 days)  
**Expected Completion:** February 9, 2025  
**Last Updated:** January 21, 2025