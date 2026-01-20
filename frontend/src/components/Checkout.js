import React, { useState } from 'react';
import './Checkout.css';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function Checkout({ cart, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customerId: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customerId: formData.customerId || 'user_guest',
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
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

  const getTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return subtotal + 2.00;
  };

  return (
    <div className="checkout-container">
      <h2>📝 Checkout</h2>

      <div className="checkout-content">
        <div className="checkout-form">
          <h3>Delivery Information</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer ID (optional)</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="Leave blank for guest checkout"
              />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                placeholder="123 Dorm Hall, Room 405, Northeastern University"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Delivery Instructions</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleChange}
                placeholder="Call when you arrive, ring doorbell twice, etc."
                rows="2"
              />
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <div className="checkout-actions">
              <button type="button" onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? 'Placing Order...' : `Place Order - $${getTotal().toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.productId} className="summary-item">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>$2.00</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;