import React from 'react';
import './Cart.css';

function Cart({ cart, setCart, onCheckout }) {
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + 2.00; // $2 delivery fee
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart ({cart.length} items)</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.productId} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)} each</p>
            </div>
            
            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              className="cart-item-remove"
              onClick={() => removeItem(item.productId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal:</span>
          <span>${getSubtotal().toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery Fee:</span>
          <span>$2.00</span>
        </div>
        <div className="cart-summary-row cart-total">
          <span>Total:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        
        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;