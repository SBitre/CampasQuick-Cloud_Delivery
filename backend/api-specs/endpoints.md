# CampusQuick API Documentation

## Base URL

**Production:**
```
https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products

## Authentication

Currently, no authentication is required. This will be added in Phase 2 using AWS Cognito.

---

## Endpoints

### 1. Get All Products

Retrieves all available products from the catalog.

**Endpoint:** `GET /products`

**Request:**
```
GET /products HTTP/1.1
Host: YOUR-API-ID.execute-api.us-east-1.amazonaws.com
```

**Response (200 OK):**
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
      "imageUrl": "https://via.placeholder.com/150?text=RedBull",
      "description": "8.4 fl oz can, sugar-free available"
    },
    ...
  ]
}
```

**Response (500 Error):**
```json
{
  "success": false,
  "error": "Error message details"
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved products
- `500 Internal Server Error`: Server-side error (check CloudWatch logs)

**Example using cURL:**
```bash
curl https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products
```

**Example using JavaScript (fetch):**
```javascript
fetch('https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products')
  .then(response => response.json())
  .then(data => console.log(data.products));
```

---

## Coming Soon

### 2. Create Order (POST /orders)
- Create a new order
- Status: In development

### 3. Get Order by ID (GET /orders/{orderId})
- Retrieve specific order details
- Status: Planned

### 4. Get User Orders (GET /orders/user/{userId})
- Get all orders for a specific user
- Status: Planned

### 5. Update Order Status (PUT /admin/orders/{orderId})
- Admin-only endpoint to update order status
- Status: Planned

---

## Error Handling

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common error scenarios:
- **DynamoDB Access Denied**: Lambda function lacks IAM permissions
- **Table Not Found**: DynamoDB table doesn't exist
- **Invalid Request**: Malformed request body or parameters

---

## CORS Configuration

All endpoints include CORS headers to allow browser-based access:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Testing

### Using Browser
Simply paste the full URL in your browser:
```
https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/products
```

### Using Postman
1. Create new GET request
2. URL: `https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products`
3. Send

### Using Python
```python
import requests

response = requests.get('https://izwyw9e314.execute-api.us-east-1.amazonaws.com/prod/products')
data = response.json()
print(f"Found {data['count']} products")
```

---

## Rate Limits

- **API Gateway Default:** 10,000 requests per second
- **Throttle Limit:** 5,000 requests per second
- **Burst:** 10,000 requests

For production use, consider implementing:
- API keys for tracking
- Usage plans for different tiers
- Request throttling per customer

---

**Last Updated:** January 15, 2025  
**API Version:** v1.0  
**Maintained By:** CampusQuick Development Team
