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
    Get a specific order by orderId.
    
    Path parameter: orderId (from /orders/{orderId})
    
    Returns order details
    """
    
    try:
        # Get orderId from path parameters
        order_id = event.get('pathParameters', {}).get('orderId')
        
        if not order_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Missing orderId in path'
                })
            }
        
        # Get order from DynamoDB
        # Note: We need both orderId and createdAt since createdAt is the sort key
        # For now, we'll use scan with filter (not ideal but works for demo)
        # In production, you'd store orderId as a GSI or use a different approach
        
        response = orders_table.scan(
            FilterExpression='orderId = :orderId',
            ExpressionAttributeValues={
                ':orderId': order_id
            }
        )
        
        orders = response.get('Items', [])
        
        if not orders:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': f'Order not found: {order_id}'
                })
            }
        
        order = orders[0]  # Should only be one order with this ID
        
        # Convert Decimals to float for JSON
        order_json = json.loads(json.dumps(order, default=decimal_default))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'order': order_json
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