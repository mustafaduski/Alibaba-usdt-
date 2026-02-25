let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, img) {
    const item = { name, price, img, qty: 1 };
    const exists = cart.find(i => i.name === name);
    
    if (exists) {
        exists.qty++;
    } else {
        cart.push(item);
    }
    
    saveCart();
    updateCartUI();
    alert('Add to cart successfully!');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }
}
