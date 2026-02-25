document.getElementById('footer-menu').innerHTML = `
    <div class="nav-item" onclick="window.location.href='index.html'">
        <span>🏠</span><br>Home
    </div>
    <div class="nav-item" onclick="window.location.href='checkout.html'" style="position:relative;">
        <span>🛒</span><br>Cart
        <b id="cart-count" style="position:absolute; top:-5px; right:10px; background:red; color:white; border-radius:50%; padding:2px 6px; font-size:10px;">0</b>
    </div>
    <div class="nav-item">
        <span>👤</span><br>Profile
    </div>
`;
updateCartUI();
