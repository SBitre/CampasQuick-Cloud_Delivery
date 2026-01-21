import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
        // Update local state
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'accepted',
      'accepted': 'picking',
      'picking': 'out_for_delivery',
      'out_for_delivery': 'delivered'
    };
    return statusFlow[currentStatus] || null;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'picking': 'Picking',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered'
    };
    return labels[status] || status;
  };

  const getNextStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return null;
    
    const actionLabels = {
      'accepted': 'Accept Order',
      'picking': 'Start Picking',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Mark Delivered'
    };
    return actionLabels[nextStatus];
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inProgress: orders.filter(o => ['accepted', 'picking', 'out_for_delivery'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
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
      <div className="admin-dashboard">
        <div className="admin-loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error">{error}</div>
        <button onClick={fetchOrders} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>📋 Admin Dashboard</h2>
        <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-number">{stats.delivered}</div>
          <div className="stat-label">Delivered</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({orders.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-tab ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`filter-tab ${filter === 'picking' ? 'active' : ''}`}
          onClick={() => setFilter('picking')}
        >
          Picking
        </button>
        <button 
          className={`filter-tab ${filter === 'out_for_delivery' ? 'active' : ''}`}
          onClick={() => setFilter('out_for_delivery')}
        >
          Out for Delivery
        </button>
        <button 
          className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </button>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Address</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderId}>
                  <td className="order-id">{order.orderId}</td>
                  <td>{order.customerId?.substring(0, 8)}...</td>
                  <td>
                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="order-total">{formatPrice(order.total)}</td>
                  <td className="order-address">{order.deliveryAddress}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="order-date">{formatDate(order.createdAt)}</td>
                  <td>
                    {getNextStatus(order.status) && (
                      <button
                        className="action-btn"
                        onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.status))}
                        disabled={updating === order.orderId}
                      >
                        {updating === order.orderId ? 'Updating...' : getNextStatusLabel(order.status)}
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <span className="completed-badge">✓ Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;