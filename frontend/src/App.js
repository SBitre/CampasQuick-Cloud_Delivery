import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut, getCurrentUser } from 'aws-amplify/auth';
import './App.css';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AuthComponent from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import awsconfig from './aws-config';

Amplify.configure(awsconfig);

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('campusquick_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    checkUser();
  };

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Get user groups
      const session = await fetchAuthSession();
      const groups = session.tokens?.idToken?.payload['cognito:groups'] || [];
      setUserGroups(groups);
      
      fetchProducts();
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSignIn = async (cognitoUser) => {
    setUser(cognitoUser);
    const session = await fetchAuthSession();
    const groups = session.tokens?.idToken?.payload['cognito:groups'] || [];
    setUserGroups(groups);
    fetchProducts();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setUserGroups([]);
      setCart([]);
      setView('products');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

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

  // Check if user is admin
  const isAdmin = userGroups.includes('admins');

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // If not logged in, show auth screen
  if (!user) {
    return <AuthComponent onSignIn={handleSignIn} />;
  }

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
        <div>
          <h1>🛒 CampusQuick</h1>
          <p>Fast delivery of essentials to your dorm in 20-30 minutes</p>
        </div>
        <div className="header-right">
          {/* Navigation for Admin */}
          {isAdmin && (
            <nav className="admin-nav">
              <button 
                className={`nav-btn ${view === 'products' ? 'active' : ''}`}
                onClick={() => setView('products')}
              >
                🛍️ Shop
              </button>
              <button 
                className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
                onClick={() => setView('admin')}
              >
                📋 Admin
              </button>
            </nav>
          )}
          <div className="header-user">
            <span>Welcome, {user.signInDetails?.loginId || user.username?.substring(0, 8) + '...'}</span>
            {userGroups.length > 0 && (
              <span className="user-role">({userGroups[0]})</span>
            )}
            <button onClick={handleSignOut} className="signout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard View */}
      {view === 'admin' && isAdmin && (
        <AdminDashboard />
      )}

      {/* Customer Views */}
      {view !== 'admin' && (
        <>
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/280x180/1a5e3a/ffffff?text=${encodeURIComponent(product.name)}`;
                      }}
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
              userEmail={user.signInDetails?.loginId || user.username}
            />
          )}

          {view === 'confirmation' && (
            <OrderConfirmation
              order={completedOrder}
              onNewOrder={handleNewOrder}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;