import React from 'react';
import './Cart.css';

function Cart({ cart, setCart, onCheckout }) {
  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 2.00;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="cart">
        <h2>🛒 Your Cart</h2>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>🛒 Your Cart</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.productId} className="cart-item">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="cart-item-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/80x80/1a5e3a/ffffff?text=${encodeURIComponent(item.name.substring(0, 10))}`;
              }}
            />
            
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">${item.price.toFixed(2)} each</div>
            </div>
            
            <div className="cart-item-quantity">
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.productId, -1)}
              >
                −
              </button>
              <span className="quantity-number">{item.quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.productId, 1)}
              >
                +
              </button>
            </div>
            
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              className="cart-item-remove"
              onClick={() => removeItem(item.productId)}
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal ({cart.reduce((t, i) => t + i.quantity, 0)} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}

export default Cart;