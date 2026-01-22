import React, { useState, useEffect } from 'react';
import './RunnerDashboard.css';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function RunnerDashboard({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('available');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/orders`);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
      } else {
        alert('Failed to update order: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const acceptOrder = async (orderId) => {
    // First set to picking, then assign runner
    await updateOrderStatus(orderId, 'picking');
  };

  const markOutForDelivery = async (orderId) => {
    await updateOrderStatus(orderId, 'out_for_delivery');
  };

  const markDelivered = async (orderId) => {
    await updateOrderStatus(orderId, 'delivered');
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'accepted': 'Ready for Pickup',
      'picking': 'Picking Up',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered'
    };
    return labels[status] || status;
  };

  // Filter orders based on selected tab
  const filteredOrders = orders.filter(order => {
    if (filter === 'available') {
      return order.status === 'accepted'; // Orders ready for runner to pick up
    } else if (filter === 'my_deliveries') {
      return ['picking', 'out_for_delivery'].includes(order.status);
    } else if (filter === 'completed') {
      return order.status === 'delivered';
    }
    return true;
  });

  const getStats = () => {
    return {
      available: orders.filter(o => o.status === 'accepted').length,
      inProgress: orders.filter(o => ['picking', 'out_for_delivery'].includes(o.status)).length,
      completed: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getStats();

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  if (loading) {
    return (
      <div className="runner-dashboard">
        <div className="runner-loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="runner-dashboard">
        <div className="runner-error">{error}</div>
        <button onClick={fetchOrders} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="runner-dashboard">
      <div className="runner-header">
        <h2>🚴 Runner Dashboard</h2>
        <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
      </div>

      {/* Stats Cards */}
      <div className="runner-stats">
        <div className="stat-card available">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Available Pickups</div>
          </div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-icon">🚴</div>
          <div className="stat-info">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed Today</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="runner-tabs">
        <button 
          className={`runner-tab ${filter === 'available' ? 'active' : ''}`}
          onClick={() => setFilter('available')}
        >
          📦 Available ({stats.available})
        </button>
        <button 
          className={`runner-tab ${filter === 'my_deliveries' ? 'active' : ''}`}
          onClick={() => setFilter('my_deliveries')}
        >
          🚴 My Deliveries ({stats.inProgress})
        </button>
        <button 
          className={`runner-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          ✅ Completed ({stats.completed})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          {filter === 'available' && '🎉 No orders waiting for pickup!'}
          {filter === 'my_deliveries' && '📭 No active deliveries'}
          {filter === 'completed' && '📊 No completed deliveries yet'}
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.orderId} className={`order-card status-${order.status}`}>
              <div className="order-card-header">
                <span className="order-id">#{order.orderId.slice(-8)}</span>
                <span className={`status-badge ${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              
              <div className="order-card-body">
                <div className="order-section">
                  <h4>📍 Delivery Address</h4>
                  <p className="delivery-address">{order.deliveryAddress}</p>
                  {order.deliveryInstructions && (
                    <p className="delivery-instructions">
                      <strong>Note:</strong> {order.deliveryInstructions}
                    </p>
                  )}
                </div>

                <div className="order-section">
                  <h4>📦 Items ({order.items?.length || 0})</h4>
                  <ul className="items-list">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-meta">
                  <span className="order-total">{formatPrice(order.total)}</span>
                  <span className="order-time">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="order-card-actions">
                {order.status === 'accepted' && (
                  <button 
                    className="action-btn pickup-btn"
                    onClick={() => acceptOrder(order.orderId)}
                    disabled={updating === order.orderId}
                  >
                    {updating === order.orderId ? 'Processing...' : '🏪 Pick Up Order'}
                  </button>
                )}
                
                {order.status === 'picking' && (
                  <button 
                    className="action-btn out-btn"
                    onClick={() => markOutForDelivery(order.orderId)}
                    disabled={updating === order.orderId}
                  >
                    {updating === order.orderId ? 'Processing...' : '🚴 Start Delivery'}
                  </button>
                )}
                
                {order.status === 'out_for_delivery' && (
                  <button 
                    className="action-btn deliver-btn"
                    onClick={() => markDelivered(order.orderId)}
                    disabled={updating === order.orderId}
                  >
                    {updating === order.orderId ? 'Processing...' : '✅ Mark Delivered'}
                  </button>
                )}

                {order.status === 'delivered' && (
                  <div className="completed-badge">
                    ✓ Delivered Successfully
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RunnerDashboard;