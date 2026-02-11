![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-blue)



# 🛒 CampusQuick - Serverless Hyperlocal Delivery Platform

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-green?logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen)](https://d30albafirjxu4.cloudfront.net)

> A cloud-native grocery and essentials fulfillment platform designed for university campus environments, built entirely on AWS serverless architecture.

---

## 🚀 Live Demo

### 🌐 **Live Application:** [https://d30albafirjxu4.cloudfront.net](https://d30albafirjxu4.cloudfront.net)

### 🔐 **Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| 👤 Customer | `customer@test.com` | `Test123!` |
| 👔 Admin | `admin@test.com` | `Admin123!` |
| 🚴 Runner | `runner@test.com` | `Runner123!` |

---

## 📋 Project Overview

**CampusQuick** solves the problem of urgent, short-distance delivery for campus convenience stores. Students can order essentials (snacks, beverages, toiletries, etc.) and receive them within **20-30 minutes** from nearby stores.

### Business Problem
University convenience stores lack structured digital systems for fast, reliable hyperlocal delivery, leading to lost sales and poor customer experience.

### Solution
A serverless cloud platform that enables small businesses to compete with large retailers through efficient order fulfillment workflows with **$0 infrastructure cost** during development and minimal cost at scale.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│       React SPA → AWS Amplify Auth → S3 + CloudFront            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (REST)                          │
│    GET /products    │    POST /orders    │    PUT /admin/orders │
│    GET /orders/user │    GET /orders/id  │    GET /admin/orders │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAMBDA FUNCTIONS (6)                          │
│  GetProducts │ CreateOrder │ GetUserOrders │ GetOrderById       │
│              │ GetAllOrders │ UpdateOrderStatus                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DYNAMODB                                   │
│   Products (50 items)  │  Orders (2 GSIs)  │  Users             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITO USER POOL                             │
│           customers  │  admins  │  runners                      │
└─────────────────────────────────────────────────────────────────┘
```

### AWS Services Used

| Service | Purpose |
|---------|---------|
| **S3** | Static website hosting |
| **CloudFront** | CDN + HTTPS |
| **API Gateway** | REST API (6 endpoints) |
| **Lambda** | Serverless functions (Python 3.12) |
| **DynamoDB** | NoSQL database (3 tables, 2 GSIs) |
| **Cognito** | Authentication + Authorization |
| **IAM** | Least-privilege access control |
| **CloudWatch** | Logging and monitoring |

---

## ✅ Features

### Customer Features
- 🏠 **Hero Section** - Store branding with quick stats
- 🔍 **Search Bar** - Real-time product search
- 📂 **Category Filters** - Browse by 6 categories
- 🛒 **Shopping Cart** - Add/remove items, quantity controls
- 📦 **Order Tracking** - Real-time status updates
- 🗺️ **Google Maps** - Live delivery tracking

### Admin Features
- 📊 **Dashboard** - Order statistics and overview
- 📋 **Order Management** - View and update all orders
- ✅ **Status Workflow** - Accept → Pick → Deliver

### Runner Features
- 🚴 **Delivery Dashboard** - View available pickups
- 📍 **Route Management** - Accept and complete deliveries
- 🗺️ **Map Integration** - Delivery tracking

### Product Catalog
| Category | Count |
|----------|-------|
| 🥤 Beverages | 10 |
| 🍕 Snacks & Food | 10 |
| 💊 Health & Medicine | 8 |
| 📚 Stationery | 8 |
| 🧴 Personal Care | 8 |
| 🔌 Electronics | 6 |
| **Total** | **50 products** |

---

## 📊 Database Schema

### Orders Table
```json
{
  "orderId": "order_1738500000000",
  "customerId": "cognito-user-id",
  "items": [
    { "productId": "prod_001", "name": "Red Bull", "quantity": 2, "price": 3.99 }
  ],
  "subtotal": 7.98,
  "deliveryFee": 2.00,
  "total": 9.98,
  "deliveryAddress": "456 Dorm Hall, Room 302",
  "status": "pending",
  "createdAt": 1738500000000
}
```

### Order Status Flow
```
pending → accepted → picking → out_for_delivery → delivered
```

### Global Secondary Indexes
- `customerId-index` - Query orders by customer
- `status-index` - Query orders by status

---

## 💰 Cost Analysis

| Environment | Monthly Cost |
|-------------|--------------|
| Development | **$0.00** (Free Tier) |
| Production (1,000 orders) | **~$4.80** |
| Per Order Cost | **$0.0048** |

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all 50 products |
| `POST` | `/orders` | Create new order |
| `GET` | `/orders/user/{userId}` | Get user's orders |
| `GET` | `/orders/id/{orderId}` | Get order by ID |
| `GET` | `/admin/orders` | Get all orders |
| `PUT` | `/admin/orders/{orderId}` | Update order status |

**Base URL:** `https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, CSS3, AWS Amplify v6 |
| **Backend** | AWS Lambda (Python 3.12) |
| **Database** | Amazon DynamoDB |
| **Auth** | Amazon Cognito |
| **API** | Amazon API Gateway |
| **Hosting** | S3 + CloudFront |
| **Maps** | Google Maps API |

---

## 📁 Project Structure

```
CampasQuick-Cloud_Delivery/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderConfirmation.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── RunnerDashboard.js
│   │   │   ├── MyOrders.js
│   │   │   ├── OrderTrackingMap.js
│   │   │   └── SplashScreen.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── aws-config.js
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
│   └── progress-reports/
└── README.md
```

---

## 🔐 Security

| Feature | Implementation |
|---------|----------------|
| Authentication | AWS Cognito (JWT tokens) |
| Authorization | Role-based (3 user groups) |
| Encryption at Rest | DynamoDB (AWS managed keys) |
| Encryption in Transit | HTTPS (CloudFront) |
| API Security | CORS, input validation |
| IAM | Least-privilege policies |

---

## 🔮 Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| 💳 **Payment Integration** | Stripe/Square payment processing | High |
| 📱 **Mobile App** | React Native iOS/Android app | High |
| 🔔 **Push Notifications** | Real-time order updates via SNS | Medium |
| 📧 **Email Notifications** | Order confirmation via SES | Medium |
| 📈 **Analytics Dashboard** | Sales metrics and insights | Medium |
| 🤖 **AI Recommendations** | Product suggestions via Personalize | Low |
| 🎯 **Dynamic Pricing** | Surge pricing for peak hours | Low |
| 🏪 **Multi-Store Support** | Multiple campus locations | Low |

---

## 📈 AWS Well-Architected Framework

| Pillar | Implementation |
|--------|----------------|
| **Operational Excellence** | CloudWatch logging, GitHub CI/CD ready |
| **Security** | Cognito, IAM, encryption, HTTPS |
| **Reliability** | Multi-AZ DynamoDB, Lambda retries |
| **Performance** | CloudFront CDN, DynamoDB on-demand |
| **Cost Optimization** | Serverless pay-per-use, free tier |

---

## 👨‍💻 Author

**Sumukh Pitre**  
Master's in Informatics | Northeastern University

[![Email](https://img.shields.io/badge/Email-pitre.s%40northeastern.edu-red?logo=gmail)](mailto:pitre.s@northeastern.edu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sumukh048pitre-blue?logo=linkedin)](https://linkedin.com/in/sumukh048pitre)
[![GitHub](https://img.shields.io/badge/GitHub-SBitre-black?logo=github)](https://github.com/SBitre)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Course:** ITC 6420 - Introduction to Cloud Computing
- **University:** Northeastern University, Boston
- **Framework:** AWS Well-Architected Framework

---

<p align="center">
  <img src="https://img.shields.io/badge/Products-50-blue" />
  <img src="https://img.shields.io/badge/Lambda_Functions-6-orange" />
  <img src="https://img.shields.io/badge/DynamoDB_Tables-3-green" />
  <img src="https://img.shields.io/badge/User_Roles-3-purple" />
  <img src="https://img.shields.io/badge/Cost-$0/month-brightgreen" />
</p>

<p align="center">
  <b>🛒 CampusQuick - Cloud-Powered Campus Convenience</b><br>
  <i>Delivering essentials to your dorm in 20-30 minutes</i>
</p>

---

**Project Status:** ✅ Completed  
**Live URL:** [https://d30albafirjxu4.cloudfront.net](https://d30albafirjxu4.cloudfront.net)  
**Completed:** February 8, 2025

## 🤝 Contributing

Contributions are welcome! 
### How to Contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Open Issues:
Check out our [open issues](https://github.com/SBitre/CampasQuick-Cloud_Delivery/issues) for features you can work on!

### Priority Features Needed:
- 💳 Payment Integration (Stripe)
- 📧 Email Notifications (AWS SES)
- 📱 Mobile App (React Native)
