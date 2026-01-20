import React, { useState, useEffect } from 'react';
import './App.css';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products');
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('campusquick_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('campusquick_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.productId);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
    setCart([]);
    localStorage.removeItem('campusquick_cart');
    setView('confirmation');
  };

  const handleNewOrder = () => {
    setCompletedOrder(null);
    setView('products');
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🛒 CampusQuick</h1>
        <p>Fast delivery of essentials to your dorm in 20-30 minutes</p>
      </header>

      {cart.length > 0 && view !== 'confirmation' && (
        <div className="cart-badge" onClick={() => setView(view === 'cart' ? 'products' : 'cart')}>
          🛒 {view === 'cart' || view === 'checkout' ? 'Continue Shopping' : 'View Cart'} 
          {view === 'products' && <span className="cart-count">{getTotalItems()}</span>}
        </div>
      )}

      {view === 'products' && (
        <div className="products-container">
          <h2>📦 Available Products ({products.length})</h2>
          
          <div className="products-grid">
            {products.map(product => (
              <div key={product.productId} className="product-card">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="product-image"
                />
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-footer">
                  <div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-stock">Stock: {product.stock}</div>
                  </div>
                </div>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'cart' && (
        <Cart 
          cart={cart} 
          setCart={setCart} 
          onCheckout={() => setView('checkout')}
        />
      )}

      {view === 'checkout' && (
        <Checkout
          cart={cart}
          onSuccess={handleOrderSuccess}
          onCancel={() => setView('cart')}
        />
      )}

      {view === 'confirmation' && (
        <OrderConfirmation
          order={completedOrder}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  );
}

export default App;