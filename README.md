# CampusQuick - Serverless Hyperlocal Delivery Platform

[![AWS](https://img.shields.io/badge/AWS-Cloud-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A cloud-native grocery and essentials fulfillment platform designed for university campus environments, built with AWS serverless architecture.

## 🚀 Live Demo

**API Endpoint (Products):**  
```
https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products
```

Try it in your browser! Returns all 15 products in JSON format. ✨

---

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
│   │   └── getProducts/  # ✅ Completed
│   │       └── lambda_function.py
│   ├── api-specs/        # API documentation
│   │   └── endpoints.md
│   └── dynamodb-schema.md # Database schema
├── infrastructure/
│   └── terraform/        # Infrastructure as Code (future)
├── docs/
│   ├── architecture/     # Architecture diagrams
│   │   └── campusquick_architecture.md
│   └── progress-reports/ # Project milestones
│       └── week1-progress.md
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
  "imageUrl": "https://via.placeholder.com/150?text=RedBull",
  "description": "8.4 fl oz can, sugar-free available"
}
```

**Current Data:** 15 products across 6 categories (beverages, food, medicine, stationery, toiletries, electronics)

### Orders Table (DynamoDB)
```json
{
  "orderId": "order_20250115_001",
  "customerId": "user_abc123",
  "items": [...],
  "total": 12.99,
  "deliveryAddress": "123 Dorm Hall, Room 405",
  "status": "pending",
  "createdAt": 1736956800000
}
```

**Status Flow:**  
`pending` → `accepted` → `picking` → `out_for_delivery` → `delivered`

### Users Table (DynamoDB)
```json
{
  "userId": "cognito-uuid",
  "userType": "customer",
  "email": "john.doe@northeastern.edu",
  "name": "John Doe",
  "phone": "+1-617-555-0100",
  "defaultAddress": "123 Dorm Hall, Room 405"
}
```

---

## 🔐 Security

- **Authentication:** AWS Cognito (JWT tokens) - *Coming in Phase 2*
- **Authorization:** Role-based access control (customer/admin/runner groups)
- **Data Encryption:** 
  - At-rest: DynamoDB encryption (AWS managed keys)
  - In-transit: HTTPS enforced (API Gateway)
- **API Security:** 
  - CORS enabled (Access-Control-Allow-Origin: *)
  - Rate limiting (10,000 req/s default)
  - Input validation in Lambda functions
- **IAM:** Least-privilege roles (Lambda has DynamoDBReadOnlyAccess)
- **Monitoring:** CloudWatch logs for all Lambda executions

---

## 🎓 Learning Objectives

This project demonstrates understanding of:

1. **Cloud-Native Architecture** - Serverless design patterns
2. **AWS Services** - Hands-on with 9+ AWS services
3. **API Design** - RESTful API best practices
4. **Security** - IAM roles, encryption, CORS
5. **Cost Optimization** - Pay-per-use pricing model
6. **Scalability** - Auto-scaling infrastructure
7. **DevOps** - Version control, documentation
8. **Business Systems Analysis** - IT solutions for real-world problems

---

## 📈 AWS Well-Architected Framework Alignment

| Pillar | Implementation |
|--------|----------------|
| **Operational Excellence** | CloudWatch monitoring, GitHub version control |
| **Security** | IAM roles, DynamoDB encryption, HTTPS enforced |
| **Reliability** | Multi-AZ DynamoDB, Lambda automatic retries |
| **Performance Efficiency** | DynamoDB on-demand, Lambda 128MB memory |
| **Cost Optimization** | Serverless (pay-per-use), $1 billing alerts |

---

## 🚧 Development Roadmap

### Phase 1: Foundation (Week 1) ✅ COMPLETED
- [x] Project planning and business analysis
- [x] Architecture design with AWS services selection
- [x] GitHub repository setup with professional structure
- [x] DynamoDB tables created (Products, Orders, Users)
- [x] 15 sample products added across 6 categories
- [x] Lambda function: `getProducts` (Python 3.12)
- [x] API Gateway REST API configured
- [x] IAM permissions configured (DynamoDB read access)
- [x] CORS enabled for frontend integration
- [x] API deployed to production (prod stage)
- [x] Working public API endpoint: GET /products
- [x] Comprehensive documentation (API, schema, progress)

**Achievements:**
- 🎯 3 days completed in 1 session (ahead of schedule!)
- 💰 $0.00 AWS costs (within free tier)
- ⚡ 300ms average API response time
- 📊 15/15 products successfully stored and retrievable

### Phase 2: Core Features (Week 2-3)
- [ ] Create Order Lambda function (POST /orders)
- [ ] Update Order Status Lambda function (PUT /admin/orders/{id})
- [ ] Get User Orders Lambda function (GET /orders/user/{id})
- [ ] React frontend (product catalog, cart, checkout)
- [ ] Cognito authentication setup
- [ ] Admin dashboard for order management
- [ ] Runner interface for deliveries

### Phase 3: Testing & Deployment (Week 4)
- [ ] End-to-end testing with Postman
- [ ] CloudWatch anomaly detection setup
- [ ] S3 static website hosting
- [ ] CloudFront CDN configuration
- [ ] Security audit and review
- [ ] Load testing (simulate 100 concurrent orders)
- [ ] Final documentation and user guide

### Phase 4: Enhancements (Post-MVP)
- [ ] Real-time notifications (SNS/SES)
- [ ] WebSocket API for live order tracking
- [ ] Analytics dashboard (CloudWatch metrics)
- [ ] AI-powered product recommendations
- [ ] Payment integration (Stripe)
- [ ] Dynamic pricing for perishables

---

## 📝 Documentation

- [Architecture Documentation](docs/architecture/campusquick_architecture.md)
- [API Specification](backend/api-specs/endpoints.md)
- [DynamoDB Schema](backend/dynamodb-schema.md)
- [Week 1 Progress Report](docs/progress-reports/week1-progress.md)
- Deployment Guide (coming soon)
- User Guide (coming soon)

---

## 🧪 Testing

### Test the API

**Using Browser:**
```
https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products
```

**Using cURL:**
```bash
curl https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products
```

**Using Python:**
```python
import requests

response = requests.get('https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products')
data = response.json()
print(f"Found {data['count']} products")
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "products": [
    {
      "productId": "prod_001",
      "name": "Red Bull Energy Drink",
      "category": "beverages",
      "price": 3.99,
      "stock": 50,
      ...
    },
    ...
  ]
}
```

---

## 👨‍💻 Author

**Sumukh Pitre**  
Northeastern University - MS in Informatics (Cloud Concentration)

**Contact:**
- Email: pitre.s@northeastern.edu
- LinkedIn: [linkedin.com/in/sumukhpitre](https://www.linkedin.com/in/sumukhpitre)
- GitHub: [github.com/SBitre](https://github.com/SBitre)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Course:** Introduction to Cloud Computing - Northeastern University
- **Inspiration:** Real-world problem faced by campus convenience stores
- **Technologies:** Built with AWS serverless services
- **Guidance:** AWS Well-Architected Framework principles

---

## 📊 Project Metrics

**Development:**
- **Days Completed:** 5 out of 28 (ahead of schedule)
- **Lines of Code:** ~100 (Lambda function + documentation)
- **AWS Resources:** 7 (3 DynamoDB tables, 1 Lambda, 1 API Gateway, 1 IAM role, 1 policy)
- **Documentation:** 4 markdown files (1,500+ lines)

**Performance:**
- **API Response Time:** ~300ms (cold start), ~150ms (warm)
- **DynamoDB Query Latency:** <10ms
- **Lambda Memory Usage:** 93 MB / 128 MB allocated

**Cost (Current):**
- **DynamoDB:** $0.00 (15 items, ~50 reads/day)
- **Lambda:** $0.00 (10 invocations, well under free tier)
- **API Gateway:** $0.00 (20 requests, under free tier)
- **Total:** $0.00/month

**Cost (Projected Production):**
- **Estimated Monthly Cost:** $1.50 for 1,000 orders/month
- **Per Order Cost:** $0.0015

---

## 🎯 Key Features Built

✅ **Serverless Architecture** - No servers to manage, auto-scaling  
✅ **RESTful API** - Clean, documented endpoints  
✅ **NoSQL Database** - Fast, scalable DynamoDB tables  
✅ **Cloud-Native** - Built entirely on AWS managed services  
✅ **Cost-Optimized** - Pay-per-use, $0 when idle  
✅ **Production-Ready** - Live API endpoint accessible globally  
✅ **Well-Documented** - Comprehensive docs for every component  

---

**Status:** 🚧 In Active Development  
**Expected Completion:** February 9, 2025  
**Progress:** 18% Complete (5/28 days)

---

*Last Updated: January 15, 2025*  
*Next Milestone: Create Order endpoint (Day 6) - January 16, 2025*