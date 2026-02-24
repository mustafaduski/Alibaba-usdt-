// لیستی بەرهەمەکان - دەتوانی ١٠٠٠ دانە لێرە زیاد بکەیت
const products = [
    {
        name: "AutoSteam Pro V2 - High Pressure Industrial",
        price: "79.99",
        image: "product.png"
    },
    {
        name: "Portable Travel Steamer 1500W Professional",
        price: "45.00",
        image: "https://sc04.alicdn.com/kf/HTB1.V8mXvfsK1RjSszgq6y8BXXaY.jpg"
    },
    {
        name: "Smart Laundry Hanger with UV Protection",
        price: "120.50",
        image: "https://sc04.alicdn.com/kf/H983675e4e84b4c73a817478052163b45O.jpg"
    }
];

// فەنکشن بۆ دروستکردنی کارتەکان بە ئۆتۆماتیکی
const grid = document.getElementById('productGrid');

products.forEach(item => {
    const card = `
        <div class="card">
            <img src="${item.image}" alt="Product">
            <div class="card-info">
                <h3>${item.name}</h3>
                <div class="card-price">US $${item.price} <span>/ Piece</span></div>
                <button class="buy-now" onclick="openOrder('${item.name}', '${item.price}')">Contact & Buy</button>
            </div>
        </div>
    `;
    grid.innerHTML += card;
});

function openOrder(name, price) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TVWRheHD5zVeXeF3jnWpZrVunaTGLZza3i&color=ff6a00`;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function copyAddr() {
    const addr = document.getElementById('walletAddr').innerText;
    navigator.clipboard.writeText(addr);
    alert("USDT TRC20 Address Copied!");
}
