// FarmDirect Frontend JS - Vanilla JS with fetch, socket.io
const API_BASE = '/api';

// Helper to get role from current URL
const getCurrentPageRole = () => {
  const path = window.location.pathname;
  if (path.includes('admin-dashboard')) return 'admin';
  if (path.includes('delivery-dashboard')) return 'deliveryboy';
  // Default to user for everything else (index, product, user-dashboard, etc.)
  return 'user';
};

// Unit label helper, based on category/name heuristics.
// Products can be sold per piece, per kg, per litre, per 100g, etc.
const getUnitLabel = (product) => {
  const cat = (product.categoryName || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (name.includes('watermelon')) return 'per kg';
  if (name.includes('paneer')) return 'per 500g';
  if (cat.includes('tea') || name.includes('tea')) return 'per 100g';
  if (cat.includes('ghee') || name.includes('ghee') || name.includes('butter')) return 'per 500g';
  if (cat.includes('milk') || name.includes('milk') || name.includes('juice') || name.match(/\bwater\b/)) return 'per L';
  if (cat.includes('fruit') || cat.includes('vegetable') || cat.includes('veggies') || name.includes('kg')) return 'per kg';
  if (name.match(/\b(ml|l|litre|liter)\b/)) return 'per L';
  if (name.match(/\b(g|gram|grams)\b/)) return 'per 100g';

  // Default to each item
  return 'each';
};

// Role-aware session helpers
const getSessionKey = (prefix) => {
  // If we are on an admin page, we always want the admin session.
  // Otherwise, we use the user session.
  const role = getCurrentPageRole();
  return `${prefix}_${role}`;
};

const getStoredToken = () => {
  // Try page-specific role first
  const role = getCurrentPageRole();
  const token = localStorage.getItem(`token_${role}`);
  if (token) return token;
  
  // Fallback to generic 'user' token if we're on a public page
  if (role === 'user') return localStorage.getItem('token_user');
  return null;
};

const getStoredUser = () => {
  const role = getCurrentPageRole();
  const userData = localStorage.getItem(`user_${role}`);
  return userData ? JSON.parse(userData) : null;
};

let token = getStoredToken();
let currentUser = getStoredUser();
const socket = (typeof io !== 'undefined') ? io() : null;

// Utils
window.apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Always use the token relevant to the current page/context
  const currentToken = getStoredToken();
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    window.logout();
  }
  return response.json();
};

window.saveAuth = (tokenData, userData) => {
  const user = tokenData.user || userData;
  const role = user.role || 'user';
  
  localStorage.setItem(`token_${role}`, tokenData.token);
  localStorage.setItem(`user_${role}`, JSON.stringify(user));
  
  // Update local variables if the saved role matches the current page role
  if (role === getCurrentPageRole()) {
    token = tokenData.token;
    currentUser = user;
  }
  
  window.updateNav();
};

window.logout = () => {
  const role = getCurrentPageRole();
  localStorage.removeItem(`token_${role}`);
  localStorage.removeItem(`user_${role}`);
  
  if (role === getCurrentPageRole()) {
    token = null;
    currentUser = null;
  }
  
  window.updateNav();
  
  // Role-based logout redirect
  if (role === 'admin') {
    window.location.href = '/admin-login.html';
  } else {
    window.location.href = '/login.html';
  }
};

window.updateNav = () => {
  // We need to decide which user to show in the nav.
  // Usually the one matching the current page role, or fallback to 'user' role
  const roleMatch = getStoredUser();
  const authBtns = document.querySelector('.auth-buttons');
  const dashboardLink = document.getElementById('dashboard-link');
  
  if (!authBtns) return;
  
  if (roleMatch) {
    authBtns.innerHTML = `
      <span style="margin-right:1rem; font-weight:600;">${roleMatch.name} (${roleMatch.role})</span>
      <a href='#' onclick='logout()' class='btn btn-secondary' style="padding:0.4rem 0.8rem;">Logout</a>
    `;
    if (dashboardLink) {
      dashboardLink.style.display = 'block';
      dashboardLink.href = getDashboardUrl(roleMatch.role);
    }
  } else {
    authBtns.innerHTML = `
      <a href='/login.html' class='btn btn-secondary' style="padding:0.4rem 0.8rem;">Login</a>
      <a href='/register.html' class='btn btn-primary' style="padding:0.4rem 0.8rem;">Register</a>
    `;
    if (dashboardLink) dashboardLink.style.display = 'none';
  }
  
  showRoleNav(roleMatch?.role);
};

const getDashboardUrl = (role) => {
  const r = role || (getStoredUser()?.role);
  if (r === 'admin') return '/admin-dashboard.html';
  if (r === 'deliveryboy') return '/delivery-dashboard.html';
  return '/user-dashboard.html';
};

const showRoleNav = (role) => {
  const adminLinks = document.querySelectorAll('.admin-only');
  const deliveryLinks = document.querySelectorAll('.delivery-only');
  const userLinks = document.querySelectorAll('.user-only');
  adminLinks.forEach(l => l.style.display = role === 'admin' ? 'block' : 'none');
  deliveryLinks.forEach(l => l.style.display = role === 'deliveryboy' ? 'block' : 'none');
  userLinks.forEach(l => l.style.display = (role === 'user' || !role) ? 'block' : 'none');
};

// Socket listeners
if (socket) {
  socket.on('delivery-location', (location) => {
    console.log('New delivery location:', location);
  });
  socket.on('new-message', (msg) => {
    if (typeof addChatMessage === 'function') addChatMessage(msg);
  });
  socket.on('order-status', (status) => {
    console.log('Order status:', status);
  });
}

// Cart
window.cart = JSON.parse(localStorage.getItem('cart') || '[]');
window.updateCart = () => {
  localStorage.setItem('cart', JSON.stringify(window.cart));
};

window.updateCartUI = () => {
  const count = window.cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge-count');
  if (badge) badge.textContent = count;
};

window.addToCart = (groceryId, name, price, imageUrl, unitLabel = '') => {
  const existing = window.cart.find(item => item.groceryId === groceryId);
  if (existing) {
    existing.qty += 1;
  } else {
    window.cart.push({ groceryId, name, price, qty: 1, imageUrl, unitLabel });
  }
  window.updateCart();
  window.updateCartUI();
  alert(`Successfully added ${name} to your basket!`);
};

window.getCartTotal = () => window.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

window.createProductCard = (g) => {
  const unitLabel = getUnitLabel(g);
  return `
    <div class="grocery-card">
      <div class="grocery-image-wrapper" onclick="window.location.href='product.html?id=${g.id}'">
        <span class="category-badge">${g.categoryName || 'General'}</span>
        <img src="${g.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'}" alt="${g.name}" class="grocery-image">
      </div>
      <div class="grocery-info">
        <h3 class="grocery-name" onclick="window.location.href='product.html?id=${g.id}'">${g.name}</h3>
        <p class="grocery-desc">${g.description || ''}</p>
        <div class="price-row">
          <div>
            <span class="price">₹${g.price}</span>
            <span class="price-unit">/${unitLabel}</span>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;">
          <button class="btn btn-outline" style="padding: 0.5rem; font-size: 0.85rem;" onclick="addToCart(${g.id}, '${g.name}', ${g.price}, '${g.imageUrl || ''}', '${unitLabel}')">Add</button>
          <button class="btn btn-primary" style="padding: 0.5rem; font-size: 0.85rem; background: #27AE60;" onclick="buyNow(${g.id}, '${g.name}', ${g.price}, '${g.imageUrl || ''}', '${unitLabel}')">Buy</button>
        </div>
        <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem; padding: 0.4rem; font-size: 0.85rem;" onclick="window.location.href='product.html?id=${g.id}'">Details</button>
      </div>
    </div>
  `;
};

window.buyNow = (groceryId, name, price, imageUrl, unitLabel = '') => {
  const existing = window.cart.find(item => item.groceryId === groceryId);
  if (existing) {
    existing.qty += 1;
  } else {
    window.cart.push({ groceryId, name, price, qty: 1, imageUrl, unitLabel });
  }
  window.updateCart();
  window.location.href = 'checkout.html';
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  window.updateNav();
  window.updateCartUI();
});
