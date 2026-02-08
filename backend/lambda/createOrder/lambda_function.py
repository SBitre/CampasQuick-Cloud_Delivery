import json
import boto3
import time
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
orders_table = dynamodb.Table('CampusQuick-Orders')
products_table = dynamodb.Table('CampusQuick-Products')

def decimal_default(obj):
    """Helper to convert Decimal to float for JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Create a new order in DynamoDB.
    
    Expected input (JSON body):
    {
        "customerId": "user_abc123",
        "items": [
            {"productId": "prod_001", "quantity": 2}
        ],
        "deliveryAddress": "123 Dorm Hall, Room 405",
        "deliveryInstructions": "Call when you arrive"
    }
    """
    
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Validate required fields
        required_fields = ['customerId', 'items', 'deliveryAddress']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': f'Missing required field: {field}'
                    })
                }
        
        # Validate items array
        if not body['items'] or len(body['items']) == 0:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Order must contain at least one item'
                })
            }
        
        # Calculate order totals and validate products
        subtotal = Decimal('0')
        enriched_items = []
        
        for item in body['items']:
            # Get product details from Products table
            product_response = products_table.get_item(
                Key={'productId': item['productId']}
            )
            
            if 'Item' not in product_response:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': f"Product not found: {item['productId']}"
                    })
                }
            
            product = product_response['Item']
            
            # Check stock
            if int(product['stock']) < item['quantity']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': f"Insufficient stock for {product['name']}. Available: {int(product['stock'])}"
                    })
                }
            
            # Calculate item total (keep as Decimal)
            price = Decimal(str(product['price']))
            quantity = Decimal(str(item['quantity']))
            item_total = price * quantity
            subtotal += item_total
            
            # Enrich item with product details
            enriched_items.append({
                'productId': item['productId'],
                'name': product['name'],
                'quantity': int(item['quantity']),
                'price': price,
                'itemTotal': item_total
            })
        
        # Calculate totals (all as Decimal)
        delivery_fee = Decimal('2.00')
        total = subtotal + delivery_fee
        
        # Generate order ID
        timestamp = int(time.time() * 1000)  # milliseconds
        order_id = f"order_{timestamp}"
        
        # Create order object (all numbers as Decimal)
        order = {
            'orderId': order_id,
            'customerId': body['customerId'],
            'createdAt': timestamp,
            'items': enriched_items,
            'subtotal': subtotal,
            'deliveryFee': delivery_fee,
            'total': total,
            'deliveryAddress': body['deliveryAddress'],
            'deliveryInstructions': body.get('deliveryInstructions', ''),
            'status': 'pending',
            'runnerId': None,
            'acceptedAt': None,
            'deliveredAt': None
        }
        
        # Save to DynamoDB
        orders_table.put_item(Item=order)
        
        # Convert Decimals to float for JSON response
        response_order = json.loads(json.dumps(order, default=decimal_default))
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Order created successfully',
                'order': response_order
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }