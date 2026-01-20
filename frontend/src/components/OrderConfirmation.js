import React from 'react';
import './OrderConfirmation.css';

function OrderConfirmation({ order, onNewOrder }) {
  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">✅</div>
      <h2>Order Placed Successfully!</h2>
      <p className="confirmation-subtitle">Your order will arrive in 20-30 minutes</p>

      <div className="order-details">
        <div className="detail-row">
          <span className="detail-label">Order ID:</span>
          <span className="detail-value">{order.orderId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total:</span>
          <span className="detail-value">${order.total.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Delivery Address:</span>
          <span className="detail-value">{order.deliveryAddress}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="status-badge">{order.status}</span>
        </div>
      </div>

      <button className="new-order-btn" onClick={onNewOrder}>
        Place Another Order
      </button>
    </div>
  );
}

export default OrderConfirmation;