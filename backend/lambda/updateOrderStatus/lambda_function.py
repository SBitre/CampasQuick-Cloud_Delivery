import json
import boto3
from decimal import Decimal
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CampusQuick-Orders')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    # Handle OPTIONS preflight request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            'body': ''
        }
    
    try:
        # Get orderId from path parameters
        order_id = event.get('pathParameters', {}).get('orderId')
        
        if not order_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'orderId is required'
                })
            }
        
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        new_status = body.get('status')
        
        # Validate status
        valid_statuses = ['pending', 'accepted', 'picking', 'out_for_delivery', 'delivered']
        if new_status not in valid_statuses:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'error': f'Invalid status. Must be one of: {valid_statuses}'
                })
            }
        
        # First, find the order to get its createdAt (sort key)
        scan_response = table.scan(
            FilterExpression='orderId = :oid',
            ExpressionAttributeValues={':oid': order_id}
        )
        
        items = scan_response.get('Items', [])
        if not items:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Order not found'
                })
            }
        
        order = items[0]
        created_at = order.get('createdAt')
        
        # Build update expression
        update_expr = 'SET #status = :status, updatedAt = :updatedAt'
        expr_names = {'#status': 'status'}
        expr_values = {
            ':status': new_status,
            ':updatedAt': int(time.time() * 1000)
        }
        
        # Add timestamp for specific status changes
        if new_status == 'accepted':
            update_expr += ', acceptedAt = :acceptedAt'
            expr_values[':acceptedAt'] = int(time.time() * 1000)
        elif new_status == 'delivered':
            update_expr += ', deliveredAt = :deliveredAt'
            expr_values[':deliveredAt'] = int(time.time() * 1000)
        
        # Update the order
        table.update_item(
            Key={
                'orderId': order_id,
                'createdAt': created_at
            },
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_values
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Order {order_id} status updated to {new_status}',
                'orderId': order_id,
                'newStatus': new_status
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }