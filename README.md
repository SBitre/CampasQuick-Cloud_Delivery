# CampusQuick - Serverless Hyperlocal Delivery Platform

[![AWS](https://img.shields.io/badge/AWS-Cloud-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A cloud-native grocery and essentials fulfillment platform designed for university campus environments, built with AWS serverless architecture.

## 🎯 Project Overview

CampusQuick solves the problem of urgent, short-distance delivery for campus convenience stores. Students can order essentials (snacks, beverages, toiletries, etc.) and receive them within 20-30 minutes from nearby stores.

**Business Problem:** University convenience stores lack structured digital systems for fast, reliable hyperlocal delivery, leading to lost sales and poor customer experience.

**Solution:** A serverless cloud platform that enables small businesses to compete with large retailers through efficient order fulfillment workflows.

---

## 🏗️ Architecture

### High-Level Design

```
Customer/Admin/Runner
        ↓
    CloudFront (CDN)
        ↓
    S3 (React Frontend)
        ↓
    API Gateway
        ↓
    Lambda Functions
        ↓
    DynamoDB
```

### AWS Services Used

| Service | Purpose | Why This Choice |
|---------|---------|----------------|
| **S3** | Static website hosting for React app | Cost-effective, highly available |
| **CloudFront** | CDN for global content delivery | Faster load times, HTTPS/SSL |
| **API Gateway** | RESTful API management | Managed service, built-in throttling |
| **Lambda** | Serverless backend functions | Auto-scaling, pay-per-use |
| **DynamoDB** | NoSQL database | Serverless, millisecond latency |
| **Cognito** | User authentication & authorization | Managed auth, JWT tokens |
| **CloudWatch** | Logging and monitoring | Centralized observability |
| **SNS/SES** | Email notifications | Managed messaging |
| **IAM** | Security and access control | Least-privilege permissions |

**Total Estimated Monthly Cost:** ~$12-15 for 1000 orders/month

---

## 🚀 Features

### MVP (Minimum Viable Product)
- ✅ Product catalog browsing
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ Admin dashboard for order management
- ✅ Order status updates (Pending → Accepted → Picking → Delivered)
- ✅ Role-based authentication (Customer, Admin, Runner)
- ✅ Order history

### Future Enhancements
- 🔄 Real-time order tracking (WebSocket)
- 🔄 Push notifications
- 🔄 Payment integration (Stripe)
- 🔄 Analytics dashboard
- 🔄 Dynamic pricing for perishables (AI-powered)
- 🔄 Product recommendations (AWS Personalize)

---

## 📁 Project Structure

```
campusquick-cloud-delivery/
├── frontend/              # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── lambda/           # Lambda function code
│   │   ├── getProducts/
│   │   ├── createOrder/
│   │   ├── updateOrderStatus/
│   │   └── ...
│   └── api-specs/        # OpenAPI/Swagger specs
├── infrastructure/
│   └── terraform/        # Infrastructure as Code (future)
├── docs/
│   ├── architecture/     # Architecture diagrams
│   └── progress-reports/ # Project milestones
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🛠️ Technology Stack

**Frontend:**
- React 18
- React Router (navigation)
- Axios (API calls)
- AWS Amplify (optional - for Cognito integration)
- Tailwind CSS (styling)

**Backend:**
- AWS Lambda (Python 3.12)
- API Gateway (REST API)
- DynamoDB (NoSQL database)

**Infrastructure:**
- AWS CloudFormation / Terraform
- AWS CLI
- Git/GitHub

**Development Tools:**
- VS Code
- Postman (API testing)
- AWS Console
- GitHub Actions (CI/CD - future)

---

## 📊 Data Model

### Products Table (DynamoDB)
```json
{
  "productId": "prod_001",
  "name": "Red Bull Energy Drink",
  "category": "beverages",
  "price": 3.99,
  "stock": 50,
  "imageUrl": "https://...",
  "createdAt": "2025-01-14T10:30:00Z"
}
```

### Orders Table (DynamoDB)
```json
{
  "orderId": "order_20250114_001",
  "customerId": "user_abc123",
  "items": [...],
  "total": 12.99,
  "deliveryAddress": "123 Dorm Hall, Room 405",
  "status": "pending",
  "createdAt": "2025-01-14T15:22:00Z"
}
```

**Status Flow:**  
`pending` → `accepted` → `picking` → `out_for_delivery` → `delivered`

---

## 🔐 Security

- **Authentication:** AWS Cognito (JWT tokens)
- **Authorization:** Role-based access control (customer/admin/runner groups)
- **Data Encryption:** 
  - At-rest: DynamoDB encryption (AWS managed keys)
  - In-transit: HTTPS enforced (CloudFront + API Gateway)
- **API Security:** 
  - CORS enabled
  - Rate limiting (10,000 req/s)
  - Input validation
- **IAM:** Least-privilege roles for all Lambda functions
- **Monitoring:** CloudWatch logs for audit trail

---

## 🎓 Learning Objectives

This project demonstrates understanding of:

1. **Cloud-Native Architecture** - Serverless design patterns
2. **AWS Services** - Hands-on with 10+ AWS services
3. **API Design** - RESTful API best practices
4. **Security** - Authentication, authorization, encryption
5. **Cost Optimization** - Pay-per-use pricing model
6. **Scalability** - Auto-scaling infrastructure
7. **DevOps** - Infrastructure as Code, monitoring
8. **Business Systems Analysis** - IT solutions for real-world problems

---

## 📈 AWS Well-Architected Framework Alignment

| Pillar | Implementation |
|--------|----------------|
| **Operational Excellence** | CloudWatch monitoring, IaC (Terraform) |
| **Security** | Cognito auth, IAM roles, encryption at-rest/in-transit |
| **Reliability** | Multi-AZ DynamoDB, Lambda retries, CloudFront failover |
| **Performance Efficiency** | CloudFront caching, DynamoDB GSIs, Lambda memory optimization |
| **Cost Optimization** | Serverless (pay-per-use), on-demand DynamoDB, billing alerts |

---

## 🚧 Development Roadmap

### Phase 1: Foundation (Week 1) ✅
- [x] Project planning
- [x] Architecture design
- [x] GitHub repository setup
- [ ] DynamoDB table creation
- [ ] Basic Lambda functions

### Phase 2: Core Features (Week 2-3)
- [ ] React frontend (product catalog, cart, checkout)
- [ ] API Gateway + Lambda integration
- [ ] Cognito authentication
- [ ] Admin dashboard
- [ ] Order management

### Phase 3: Testing & Deployment (Week 4)
- [ ] End-to-end testing
- [ ] CloudWatch monitoring setup
- [ ] S3 + CloudFront deployment
- [ ] Security review
- [ ] Documentation

### Phase 4: Enhancements (Post-MVP)
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] AI-powered features

---

## 📝 Documentation

- [Architecture Documentation](docs/architecture/campusquick_architecture.md)
- API Specification (coming soon)
- Deployment Guide (coming soon)
- User Guide (coming soon)

---

## 👨‍💻 Author

**Your Name**  
Northeastern University - MS in Informatics (Cloud Concentration)

**Contact:**
- Email: pitre.s@northeastern.edu
- LinkedIn: www.linkedin.com/in/sumukhpitre

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Course:** Introduction to Cloud Computing - Northeastern University
- **Inspiration:** Real-world problem faced by campus convenience stores
- **Technologies:** Built with AWS serverless services

---

## 📊 Project Metrics

- **Lines of Code:** TBD
- **AWS Services Used:** 9+
- **API Endpoints:** 12+
- **Development Time:** 4 weeks
- **Estimated Monthly Cost:** $12-15

---

**Status:** 🚧 In Development (Expected completion: February 2025)

---

*Last Updated: January 15, 2025*
