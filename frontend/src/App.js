import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut, getCurrentUser } from 'aws-amplify/auth';
import './App.css';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AuthComponent from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import RunnerDashboard from './components/RunnerDashboard';
import MyOrders from './components/MyOrders';
import SplashScreen from './components/SplashScreen';
import awsconfig from './aws-config';

Amplify.configure(awsconfig);

const API_BASE_URL = 'https://kz2amymiqd.execute-api.us-east-1.amazonaws.com/prod';

// Category configuration with icons
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'Beverages', name: 'Beverages', icon: '🥤' },
  { id: 'Snacks & Food', name: 'Snacks & Food', icon: '🍕' },
  { id: 'Health & Medicine', name: 'Health & Medicine', icon: '💊' },
  { id: 'Stationery', name: 'Stationery', icon: '📚' },
  { id: 'Personal Care', name: 'Personal Care', icon: '🧴' },
  { id: 'Electronics', name: 'Electronics', icon: '🔌' },
];

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
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      
      // Set default view based on role
      if (groups.includes('runners')) {
        setView('runner');
      } else if (groups.includes('admins')) {
        setView('admin');
      } else {
        setView('products');
      }
      
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
    
    // Set default view based on role
    if (groups.includes('runners')) {
      setView('runner');
    } else if (groups.includes('admins')) {
      setView('admin');
    } else {
      setView('products');
    }
    
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

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get product count by category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  // Check user roles
  const isAdmin = userGroups.includes('admins');
  const isRunner = userGroups.includes('runners');
  const isCustomer = userGroups.includes('customers') || (!isAdmin && !isRunner);

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
        <div className="loading">Loading...</div>
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
          {/* Navigation based on user role */}
          <nav className="role-nav">
            {/* Customer Navigation */}
            {isCustomer && !isRunner && (
              <>
                <button 
                  className={`nav-btn ${['products', 'cart', 'checkout', 'confirmation'].includes(view) ? 'active' : ''}`}
                  onClick={() => setView('products')}
                >
                  🛍️ Shop
                </button>
                <button 
                  className={`nav-btn ${view === 'myorders' ? 'active' : ''}`}
                  onClick={() => setView('myorders')}
                >
                  📦 My Orders
                </button>
              </>
            )}
            
            {/* Admin Navigation - can also shop */}
            {isAdmin && (
              <>
                <button 
                  className={`nav-btn ${['products', 'cart', 'checkout', 'confirmation'].includes(view) ? 'active' : ''}`}
                  onClick={() => setView('products')}
                >
                  🛍️ Shop
                </button>
                <button 
                  className={`nav-btn ${view === 'myorders' ? 'active' : ''}`}
                  onClick={() => setView('myorders')}
                >
                  📦 My Orders
                </button>
                <button 
                  className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
                  onClick={() => setView('admin')}
                >
                  📋 Admin
                </button>
              </>
            )}
            
            {/* Runner Navigation - ONLY deliveries */}
            {isRunner && !isAdmin && (
              <button 
                className={`nav-btn ${view === 'runner' ? 'active' : ''}`}
                onClick={() => setView('runner')}
              >
                🚴 Deliveries
              </button>
            )}
          </nav>
          
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

      {/* Runner Dashboard View */}
      {view === 'runner' && isRunner && (
        <RunnerDashboard userId={user.username} />
      )}

      {/* My Orders View - for customers and admins, not runners */}
      {view === 'myorders' && !isRunner && (
        <MyOrders 
          userId={user.username} 
          onBackToShop={() => setView('products')}
        />
      )}

      {/* Customer Shopping Views - for customers and admins, not runners */}
      {!['admin', 'runner', 'myorders'].includes(view) && !isRunner && (
        <>
          {cart.length > 0 && view !== 'confirmation' && (
            <div className="cart-badge" onClick={() => setView(view === 'cart' ? 'products' : 'cart')}>
              🛒 {view === 'cart' || view === 'checkout' ? 'Continue Shopping' : 'View Cart'} 
              {view === 'products' && <span className="cart-count">{getTotalItems()}</span>}
            </div>
          )}

          {view === 'products' && (
            <div className="products-container">
              {/* Hero Section */}
              <div className="hero-section">
                <div className="hero-content">
                  <h2>🏪 College Convenience</h2>
                  <p>Your campus essentials, delivered fast</p>
                  <div className="hero-stats">
                    <div className="hero-stat">
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Products</span>
                    </div>
                    <div className="hero-stat">
                      <span className="stat-number">20-30</span>
                      <span className="stat-label">Min Delivery</span>
                    </div>
                    <div className="hero-stat">
                      <span className="stat-number">$2</span>
                      <span className="stat-label">Delivery Fee</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="search-section">
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="search-clear"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Tabs */}
              <div className="category-tabs">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({getCategoryCount(category.id)})</span>
                  </button>
                ))}
              </div>

              {/* Products Header */}
              <div className="products-header">
                <h3>
                  {selectedCategory === 'all' ? '📦 All Products' : `${CATEGORIES.find(c => c.id === selectedCategory)?.icon} ${selectedCategory}`}
                  <span className="products-count">({filteredProducts.length} items)</span>
                </h3>
                {searchQuery && (
                  <p className="search-results-text">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <span className="no-products-icon">😕</span>
                  <h3>No products found</h3>
                  <p>Try a different search or category</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.productId} className="product-card">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/280x180/1a5e3a/ffffff?text=${encodeURIComponent(product.name)}`;
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
              )}
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

      {/* Runner sees only their dashboard */}
      {isRunner && !isAdmin && view !== 'runner' && (
        <div className="runner-redirect">
          <p>Redirecting to deliveries...</p>
        </div>
      )}
    </div>
  );
}

export default App;