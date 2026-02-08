import React, { useState } from 'react';
import './Checkout.css';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function Checkout({ cart, onSuccess, onCancel, userId, userEmail }) {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryInstructions: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 2.00;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customerId: userId,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          itemTotal: item.price * item.quantity
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        deliveryAddress: formData.deliveryAddress,
        deliveryInstructions: formData.deliveryInstructions
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.order);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Error placing order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <h2>📦 Checkout</h2>
      
      <div className="checkout-container">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={userEmail}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryAddress">Delivery Address *</label>
              <input
                type="text"
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="e.g., 456 Dorm Hall, Room 302"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleChange}
                placeholder="e.g., Call when you arrive, Leave at door"
                rows="3"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="checkout-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={onCancel}
              >
                ← Back to Cart
              </button>
              <button 
                type="submit" 
                className="place-order-btn"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Place Order →'}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.productId} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-qty">{item.quantity}x</span>
                  <span className="summary-item-name">{item.name}</span>
                </div>
                <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="delivery-estimate">
            <span className="estimate-icon">🚴</span>
            <span>Estimated delivery: <strong>20-30 minutes</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;