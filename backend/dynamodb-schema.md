# DynamoDB Schema Documentation

## Overview

CampusQuick uses DynamoDB (NoSQL) for all data storage. The database consists of 3 tables optimized for fast queries and scalability.

---

## Table 1: CampusQuick-Products

Stores all products available in the catalog.

**Table Configuration:**
- **Partition Key:** `productId` (String)
- **Capacity Mode:** On-Demand
- **Region:** us-east-1

**Attributes:**
```json
{
  "productId": "prod_001",           // Primary key, unique identifier
  "name": "Red Bull Energy Drink",   // Product name
  "category": "beverages",           // Category (beverages, food, medicine, etc.)
  "price": 3.99,                     // Price in USD
  "stock": 50,                       // Available quantity
  "imageUrl": "https://...",         // Product image URL
  "description": "8.4 fl oz can..."  // Product description
}
```

**Sample Query (Get Product by ID):**
```python
response = table.get_item(Key={'productId': 'prod_001'})
product = response['Item']
```

**Sample Query (Get All Products):**
```python
response = table.scan()
products = response['Items']
```

**Current Data:** 15 products across 6 categories

---

## Table 2: CampusQuick-Orders

Stores all customer orders with status tracking.

**Table Configuration:**
- **Partition Key:** `orderId` (String)
- **Sort Key:** `createdAt` (Number - Unix timestamp)
- **GSI 1:** `customerId-index` (Query orders by customer)
- **GSI 2:** `status-index` (Query orders by status)
- **Capacity Mode:** On-Demand

**Attributes:**
```json
{
  "orderId": "order_20250115_001",        // Primary key
  "customerId": "user_abc123",            // Foreign key to Users table
  "createdAt": 1736956800000,             // Unix timestamp
  "items": [                              // Array of ordered items
    {
      "productId": "prod_001",
      "name": "Red Bull Energy Drink",
      "quantity": 2,
      "price": 3.99
    }
  ],
  "subtotal": 7.98,                       // Sum of items
  "deliveryFee": 2.00,                    // Flat delivery fee
  "total": 9.98,                          // subtotal + deliveryFee
  "deliveryAddress": "123 Dorm Hall...",  // Delivery location
  "deliveryInstructions": "Call when...", // Optional instructions
  "status": "pending",                    // Order status (see below)
  "runnerId": null,                       // Runner assigned (null = unassigned)
  "acceptedAt": null,                     // Timestamp (when admin accepts)
  "deliveredAt": null                     // Timestamp (when delivered)
}
```

**Order Status Flow:**
```
pending → accepted → picking → out_for_delivery → delivered
```

**GSI 1: Query Orders by Customer**
```python
response = table.query(
    IndexName='customerId-index',
    KeyConditionExpression=Key('customerId').eq('user_abc123')
)
```

**GSI 2: Query Orders by Status**
```python
response = table.query(
    IndexName='status-index',
    KeyConditionExpression=Key('status').eq('pending')
)
```

---

## Table 3: CampusQuick-Users

Stores user profiles and authentication data.

**Table Configuration:**
- **Partition Key:** `userId` (String - from Cognito sub)
- **Sort Key:** `userType` (String - customer/admin/runner)
- **Capacity Mode:** On-Demand

**Attributes:**
```json
{
  "userId": "cognito-uuid",              // Primary key (Cognito sub)
  "userType": "customer",                // Sort key (customer/admin/runner)
  "email": "john.doe@northeastern.edu",  // User email
  "name": "John Doe",                    // Full name
  "phone": "+1-617-555-0100",            // Phone number
  "defaultAddress": "123 Dorm Hall...",  // Saved delivery address
  "createdAt": 1736000000000             // Unix timestamp
}
```

**User Types:**
- `customer`: Regular users who place orders
- `admin`: Store staff who manage orders
- `runner`: Delivery personnel

**Sample Query (Get User Profile):**
```python
response = table.get_item(
    Key={
        'userId': 'cognito-uuid',
        'userType': 'customer'
    }
)
```

---

## Design Decisions

### Why DynamoDB?

1. **Serverless:** No server management, auto-scaling
2. **Performance:** Single-digit millisecond latency
3. **Cost-effective:** Pay-per-request (on-demand mode)
4. **Reliability:** 99.99% availability SLA, multi-AZ replication

### Why NoSQL over SQL?

1. **Flexible Schema:** Easy to add new fields without migrations
2. **Scalability:** Handles millions of requests without performance degradation
3. **Simplicity:** No complex joins needed for our use case
4. **Cost:** Cheaper at scale compared to RDS for read-heavy workloads

### Access Patterns

**Products Table:**
- Get all products (for catalog page) → `scan()`
- Get product by ID (for detail page) → `get_item()`
- Filter by category (future) → Add GSI on category

**Orders Table:**
- Get all pending orders (admin dashboard) → Query `status-index`
- Get customer's orders (order history) → Query `customerId-index`
- Get order details (order tracking) → `get_item()`
- Update order status → `update_item()`

**Users Table:**
- Get user profile → `get_item()`
- Check if user exists → `get_item()`
- Update profile → `update_item()`

---

## Cost Estimate

**Current Usage (Development):**
- 15 products
- ~50 read requests/day
- ~5 write requests/day

**Estimated Cost:** $0.001/month (basically free)

**Production Usage (1000 orders/month):**
- Reads: 50,000/month
- Writes: 5,000/month
- Storage: 1 GB

**Estimated Cost:** $1.50/month

---

## Backup & Recovery

- **Point-in-time Recovery:** Enabled (can restore to any second in last 35 days)
- **On-demand Backups:** Manual snapshots before major changes
- **DynamoDB Streams:** Disabled (not needed yet, enables event-driven architecture)

---

## Future Enhancements

1. **Add TTL (Time to Live):**
   - Auto-delete old orders after 90 days
   - Reduces storage costs

2. **Enable DynamoDB Streams:**
   - Trigger Lambda when order status changes
   - Send real-time notifications

3. **Add More GSIs:**
   - `category-index` on Products (filter by category)
   - `runnerId-index` on Orders (runner dashboard)

4. **Implement Conditional Writes:**
   - Prevent race conditions (e.g., overselling stock)
   - Use `ConditionExpression` in `update_item()`

---

**Created:** January 15, 2025  
**Last Updated:** January 15, 2025