let page = 1;
let currentTerm = 'gadgets';
let cart = [];

// ١. هێنانی داتا لە ئەمازۆنەوە
async function fetchData(term, pageNum) {
    document.getElementById('loader').style.display = 'block';
    const url = `https://api.rainforestapi.com/request?api_key=${CONFIG.API_KEY}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(term)}&page=${pageNum}`;
    
    try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.search_results) {
            displayProducts(json.search_results);
        }
    } catch (e) { console.error(e); }
    document.getElementById('loader').style.display = 'none';
}

// ٢. پیشاندانی بەرهەمەکان
function displayProducts(items) {
    const grid = document.getElementById('productGrid');
    items.forEach(item => {
        let price = (parseFloat(item.price?.value || 20) * CONFIG.PROFIT_MARGIN).toFixed(2);
        grid.innerHTML += `
            <div class="card">
                <img src="${item.image}" alt="img">
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <div class="price">${price} USDT</div>
                    <button class="add-btn" onclick="addToCart('${item.title.replace(/'/g,"")}', ${price})">Add to Cart</button>
                </div>
            </div>`;
    });
}

// ٣. سیستەمی سەبەتەی کڕین
function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert("Added!");
}

function showCart() {
    const list = document.getElementById('cart-items');
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        list.innerHTML += `<p>${index+1}. ${item.name} - ${item.price} USDT</p>`;
    });
    document.getElementById('total-price').innerText = total.toFixed(2);
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() { document.getElementById('cartModal').style.display = 'none'; }

function checkout() {
    let total = document.getElementById('total-price').innerText;
    let msg = `New Order: %0A`;
    cart.forEach(i => msg += `- ${i.name} %0A`);
    msg += `%0ATotal: ${total} USDT %0APlease send to: ${CONFIG.WALLET_ADDR}`;
    window.location.href = `https://wa.me/964750XXXXXXX?text=${msg}`;
}

// ٤. گەڕان و سکڕۆڵ
function globalSearch() {
    currentTerm = document.getElementById('mainSearch').value;
    document.getElementById('productGrid').innerHTML = '';
    page = 1;
    fetchData(currentTerm, page);
}

window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        page++;
        fetchData(currentTerm, page);
    }
};

window.onload = () => fetchData(currentTerm, page);
