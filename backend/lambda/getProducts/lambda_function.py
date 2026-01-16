import json
import boto3
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CampusQuick-Products')

# Helper function to convert Decimal to float for JSON serialization
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Lambda function to retrieve all products from DynamoDB.
    
    Returns:
        dict: API Gateway response with products list
    """
    try:
        # Scan the table to get all products
        response = table.scan()
        products = response['Items']
        
        # Convert Decimal types to float for JSON
        products_json = json.loads(json.dumps(products, default=decimal_to_float))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # Enable CORS
            },
            'body': json.dumps({
                'success': True,
                'count': len(products_json),
                'products': products_json
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
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