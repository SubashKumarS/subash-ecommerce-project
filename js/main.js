// Constants & State
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Components
const navbarHTML = `
<nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm py-3">
    <div class="container">
        <a class="navbar-brand fw-bold text-primary fs-4" href="index.html">
            <i class="fas fa-shopping-bag me-2"></i>LuxeCart
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 fw-medium">
                <li class="nav-item"><a class="nav-link px-3" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="products.html">Products</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="category.html">Categories</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="about.html">About</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="contact.html">Contact</a></li>
            </ul>
            <form class="d-flex mx-lg-3 my-2 my-lg-0" action="search.html" method="get">
                <div class="input-group">
                    <input class="form-control" type="search" name="q" placeholder="Search products..." required>
                    <button class="btn btn-outline-primary" type="submit"><i class="fas fa-search"></i></button>
                </div>
            </form>
            <div class="d-flex align-items-center mt-2 mt-lg-0">
                <a href="cart.html" class="btn btn-primary position-relative px-3 py-2">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                        0
                    </span>
                </a>
            </div>
        </div>
    </div>
</nav>
`;

const footerHTML = `
<footer class="bg-dark text-light pt-5 pb-3">
    <div class="container">
        <div class="row">
            <div class="col-md-4 mb-4">
                <h5 class="fw-bold mb-3 d-flex align-items-center"><i class="fas fa-shopping-bag me-2 text-primary"></i> LuxeCart</h5>
                <p class="text-white-50">Your one-stop shop for everything you need. Quality products, fast delivery, and excellent customer service.</p>
                <div class="d-flex gap-3 mt-4">
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="fab fa-facebook fa-lg"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="fab fa-twitter fa-lg"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="fab fa-instagram fa-lg"></i></a>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <h5 class="fw-bold mb-3">Quick Links</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="index.html" class="text-white-50 text-decoration-none hover-primary">Home</a></li>
                    <li class="mb-2"><a href="products.html" class="text-white-50 text-decoration-none hover-primary">Products</a></li>
                    <li class="mb-2"><a href="about.html" class="text-white-50 text-decoration-none hover-primary">About Us</a></li>
                    <li class="mb-2"><a href="contact.html" class="text-white-50 text-decoration-none hover-primary">Contact Us</a></li>
                </ul>
            </div>
            <div class="col-md-4 mb-4">
                <h5 class="fw-bold mb-3">Contact Info</h5>
                <p class="text-white-50"><i class="fas fa-map-marker-alt me-2 text-primary"></i> 123 E-commerce St, NY 10001</p>
                <p class="text-white-50"><i class="fas fa-phone me-2 text-primary"></i> +1 (555) 123-4567</p>
                <p class="text-white-50"><i class="fas fa-envelope me-2 text-primary"></i> support@luxecart.com</p>
            </div>
        </div>
        <hr class="border-secondary mt-4 mb-3">
        <div class="text-center text-white-50 small">&copy; 2026 LuxeCart. All Rights Reserved.</div>
    </div>
</footer>
`;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Inject Components
    const headerEl = document.getElementById('header-container');
    const footerEl = document.getElementById('footer-container');
    if (headerEl) headerEl.innerHTML = navbarHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;

    // Remove preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 600);
    }

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
                scrollToTopBtn.style.justifyContent = 'center';
                scrollToTopBtn.style.alignItems = 'center';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    updateCartCount();
    
    // Page specific initialization
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('ecommerce-site/')) initHome();
    if (path.includes('products.html')) initProducts();
    if (path.includes('product-view.html')) initProductView();
    if (path.includes('cart.html')) initCart();
    if (path.includes('category.html')) initCategory();
    if (path.includes('search.html')) initSearch();
    if (path.includes('checkout.html')) initCheckout();
});

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Added to Cart', `${product.name} has been added to your shopping cart.`);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = count;
}

window.showToast = function(title, message) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-success border-0 show shadow" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong class="d-block mb-1"><i class="fas fa-check-circle me-1"></i>${title}</strong>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onclick="document.getElementById('${toastId}').remove()"></button>
            </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    setTimeout(() => {
        const toastEl = document.getElementById(toastId);
        if (toastEl) {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 300);
        }
    }, 3000);
};

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    div.style.zIndex = '1055';
    document.body.appendChild(div);
    return div;
}

// Generate Product Card HTML
function getProductCard(product) {
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 hover-shadow border-0 rounded-3 overflow-hidden">
                <img src="${product.img}" class="card-img-top product-img" alt="${product.name}">
                <div class="card-body d-flex flex-column p-3">
                    <h6 class="card-title text-truncate mb-2" title="${product.name}">${product.name}</h6>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="fs-5 fw-bold text-primary">$${product.price.toFixed(2)}</span>
                        <span class="text-warning small"><i class="fas fa-star"></i> ${product.rating}</span>
                    </div>
                    <div class="mt-auto d-grid gap-2">
                        <button class="btn btn-primary btn-sm rounded-pill fw-medium" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i> Add to Cart
                        </button>
                        <a href="product-view.html?id=${product.id}" class="btn btn-outline-secondary btn-sm rounded-pill">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Pages Logic
function initHome() {
    const latestGrid = document.getElementById('latest-products');
    if (latestGrid) {
        // Just take distinct random or first top items
        const latest = products.slice(0, 8);
        latestGrid.innerHTML = latest.map(getProductCard).join('');
    }
}

function initProducts() {
    const grid = document.getElementById('products-grid');
    if (grid) {
        renderProducts(products);
        
        // Setup filters
        document.getElementById('sort-filter').addEventListener('change', (e) => {
            let sorted = [...products];
            if (e.target.value === 'low-high') sorted.sort((a,b) => a.price - b.price);
            if (e.target.value === 'high-low') sorted.sort((a,b) => b.price - a.price);
            renderProducts(sorted);
        });

        // Category Filter
        document.getElementById('cat-filter').addEventListener('change', (e) => {
            let val = e.target.value;
            let filtered = val === 'all' ? products : products.filter(p => p.category === val);
            // apply sorting
            let sortVal = document.getElementById('sort-filter').value;
            if (sortVal === 'low-high') filtered.sort((a,b) => a.price - b.price);
            if (sortVal === 'high-low') filtered.sort((a,b) => b.price - a.price);
            renderProducts(filtered);
        });
    }
}

function renderProducts(list) {
    const grid = document.getElementById('products-grid');
    if (list.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><h5 class="text-muted">No products found matching your criteria.</h5></div>';
    } else {
        grid.innerHTML = list.map(getProductCard).join('');
    }
}

function initProductView() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('pv-img').src = product.img;
        document.getElementById('pv-title').innerText = product.name;
        document.getElementById('pv-cat').innerText = "Category: " + product.category.charAt(0).toUpperCase() + product.category.slice(1);
        document.getElementById('pv-price').innerText = '$' + product.price.toFixed(2);
        document.getElementById('pv-rating').innerHTML = '<i class="fas fa-star text-warning"></i> ' + product.rating;
        document.getElementById('pv-desc').innerText = "This is a detailed description for " + product.name + ". Made with high-quality materials and exquisite craftsmanship, it perfectly aligns with modern aesthetic and functional needs. Elevate your daily experience.";
        
        document.getElementById('pv-add-cart').addEventListener('click', () => {
            addToCart(product.id);
        });

        // Related
        const related = products.filter(p => p.category === product.category && p.id !== id).slice(0, 4);
        document.getElementById('pv-related').innerHTML = related.length > 0 ? related.map(getProductCard).join('') : '<p class="text-muted">No related products found.</p>';
    }
}

function initCart() {
    renderCart();
}

function renderCart() {
    const cartTbody = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartTbody.innerHTML = '<tr><td colspan="5" class="text-center py-5"><i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i><h5 class="text-muted">Your cart is empty.</h5><a href="products.html" class="btn btn-primary mt-3">Shop Now</a></td></tr>';
        cartTotal.innerText = '$0.00';
        document.getElementById('checkout-btn').classList.add('disabled');
        return;
    }

    document.getElementById('checkout-btn').classList.remove('disabled');
    
    let total = 0;
    cartTbody.innerHTML = cart.map((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
            <tr>
                <td class="py-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover" class="me-3 rounded shadow-sm">
                        <span class="fw-medium">${item.name}</span>
                    </div>
                </td>
                <td class="py-3 align-middle">$${item.price.toFixed(2)}</td>
                <td class="py-3 align-middle">
                    <div class="input-group input-group-sm rounded bg-light" style="width: 110px;">
                        <button class="btn btn-outline-secondary border-0" onclick="updateQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                        <input type="text" class="form-control text-center border-0 bg-light" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary border-0" onclick="updateQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                </td>
                <td class="py-3 align-middle fw-medium">$${subtotal.toFixed(2)}</td>
                <td class="py-3 align-middle">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    cartTotal.innerText = '$' + total.toFixed(2);
}

window.updateQty = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function initCategory() {
    const list = document.getElementById('category-list');
    if (list) {
        list.innerHTML = categories.map(c => `
            <div class="col-md-4 mb-4">
                <a href="search.html?cat=${c.id}" class="text-decoration-none">
                    <div class="card bg-dark border-0 hover-shadow overflow-hidden rounded-4">
                        <img src="${c.img}" class="card-img" alt="${c.name}" style="height: 350px; object-fit: cover; opacity: 0.6; transition: opacity 0.3s;">
                        <div class="card-img-overlay d-flex flex-column align-items-center justify-content-center">
                            <h2 class="card-title text-white fw-bold display-5 text-shadow">${c.name}</h2>
                            <span class="btn btn-outline-light rounded-pill mt-3 px-4">Explore</span>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }
}

function initSearch() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const cat = params.get('cat');
    const title = document.getElementById('search-title');
    const grid = document.getElementById('search-results');
    
    let filtered = products;
    if (q) {
        filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()));
        title.innerText = "Search Results for: '" + q + "'";
    } else if (cat) {
        filtered = products.filter(p => p.category === cat);
        title.innerText = "Category: " + (categories.find(c => c.id === cat)?.name || cat);
    }
    
    if (filtered.length > 0) {
        grid.innerHTML = filtered.map(getProductCard).join('');
    } else {
        grid.innerHTML = `<div class="col-12 py-5 text-center"><h4 class="text-muted">No products match your search criteria.</h4></div>`;
    }
}

function initCheckout() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const checkoutForm = document.getElementById('checkout-form');
    // Fill Order Summary
    const summary = document.getElementById('checkout-summary');
    let total = 0;
    summary.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<li class="list-group-item d-flex justify-content-between lh-sm px-3 py-3">
            <div>
                <h6 class="my-0">${item.name}</h6>
                <small class="text-muted">Qty: ${item.quantity}</small>
            </div>
            <span class="text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
        </li>`;
    }).join('');
    summary.innerHTML += `
        <li class="list-group-item d-flex justify-content-between bg-light px-3 py-3">
            <span class="text-success fw-medium">Promo code</span>
            <span class="text-success">-$0.00</span>
        </li>
        <li class="list-group-item d-flex justify-content-between px-3 py-3">
            <span class="fw-bold">Total (USD)</span>
            <strong class="fs-5">$${total.toFixed(2)}</strong>
        </li>
    `;

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (checkoutForm.checkValidity()) {
            localStorage.removeItem('cart'); // clear cart
            window.location.href = 'order-confirmation.html?id=' + Math.floor(100000 + Math.random() * 900000);
        }
        checkoutForm.classList.add('was-validated');
    });
}
