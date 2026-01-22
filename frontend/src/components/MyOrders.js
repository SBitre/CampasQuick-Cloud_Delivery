import React, { useState, useEffect } from 'react';
import './MyOrders.css';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function MyOrders({ userId, onBackToShop }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchMyOrders();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchMyOrders, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        label: 'Order Placed',
        icon: '📝',
        color: '#f39c12',
        description: 'Waiting for store to accept',
        step: 1
      },
      'accepted': {
        label: 'Accepted',
        icon: '✅',
        color: '#3498db',
        description: 'Store is preparing your order',
        step: 2
      },
      'picking': {
        label: 'Being Picked',
        icon: '🛒',
        color: '#9b59b6',
        description: 'Runner is picking up items',
        step: 3
      },
      'out_for_delivery': {
        label: 'On The Way',
        icon: '🚴',
        color: '#e67e22',
        description: 'Your order is on the way!',
        step: 4
      },
      'delivered': {
        label: 'Delivered',
        icon: '🎉',
        color: '#27ae60',
        description: 'Order completed',
        step: 5
      }
    };
    return statusMap[status] || { label: status, icon: '❓', color: '#666', description: '', step: 0 };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="my-orders">
        <div className="my-orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders">
        <div className="my-orders-error">
          <p>{error}</p>
          <button onClick={fetchMyOrders} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <button className="back-btn" onClick={onBackToShop}>
          ← Back to Shop
        </button>
        <h2>📦 My Orders</h2>
        <button className="refresh-btn" onClick={fetchMyOrders}>
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">🛒</div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
          <button className="shop-btn" onClick={onBackToShop}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const isExpanded = expandedOrder === order.orderId;
            const isActive = !['delivered'].includes(order.status);
            
            return (
              <div 
                key={order.orderId} 
                className={`order-card ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Order Header - Always Visible */}
                <div 
                  className="order-header"
                  onClick={() => toggleOrderDetails(order.orderId)}
                >
                  <div className="order-header-left">
                    <span className="order-status-icon">{statusInfo.icon}</span>
                    <div className="order-header-info">
                      <span className="order-id">Order #{order.orderId.slice(-8)}</span>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="order-header-right">
                    <span 
                      className="order-status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="order-total">{formatPrice(order.total)}</span>
                    <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Progress Tracker - For Active Orders */}
                {isActive && (
                  <div className="order-progress">
                    <div className="progress-track">
                      {['pending', 'accepted', 'picking', 'out_for_delivery', 'delivered'].map((step, index) => {
                        const stepInfo = getStatusInfo(step);
                        const isCompleted = statusInfo.step > stepInfo.step;
                        const isCurrent = statusInfo.step === stepInfo.step;
                        
                        return (
                          <div 
                            key={step}
                            className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                          >
                            <div className="step-dot">
                              {isCompleted ? '✓' : stepInfo.icon}
                            </div>
                            <span className="step-label">{stepInfo.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="status-description">{statusInfo.description}</p>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-details">
                    <div className="order-section">
                      <h4>📍 Delivery Address</h4>
                      <p>{order.deliveryAddress}</p>
                      {order.deliveryInstructions && (
                        <p className="delivery-note">
                          <strong>Note:</strong> {order.deliveryInstructions}
                        </p>
                      )}
                    </div>

                    <div className="order-section">
                      <h4>🛒 Items</h4>
                      <ul className="items-list">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">{formatPrice(item.itemTotal || item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-section order-totals">
                      <div className="total-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="total-row">
                        <span>Delivery Fee</span>
                        <span>{formatPrice(order.deliveryFee)}</span>
                      </div>
                      <div className="total-row final">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="auto-refresh-notice">
        🔄 Auto-refreshing every 30 seconds
      </div>
    </div>
  );
}

export default MyOrders;