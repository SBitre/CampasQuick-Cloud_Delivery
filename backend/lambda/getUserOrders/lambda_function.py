import json
import boto3
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
orders_table = dynamodb.Table('CampusQuick-Orders')

def decimal_default(obj):
    """Convert Decimal to float for JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Get all orders for a specific customer.
    
    Path parameter: userId (from /orders/user/{userId})
    
    Returns list of orders sorted by createdAt (newest first)
    """
    
    try:
        # Get userId from path parameters
        user_id = event.get('pathParameters', {}).get('userId')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Missing userId in path'
                })
            }
        
        # Query orders by customerId using GSI
        response = orders_table.query(
            IndexName='customerId-index',
            KeyConditionExpression='customerId = :userId',
            ExpressionAttributeValues={
                ':userId': user_id
            },
            ScanIndexForward=False  # Sort descending (newest first)
        )
        
        orders = response.get('Items', [])
        
        # Convert Decimals to float for JSON
        orders_json = json.loads(json.dumps(orders, default=decimal_default))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'count': len(orders_json),
                'orders': orders_json
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