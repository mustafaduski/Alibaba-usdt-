let page = 1;
let currentTerm = 'smart technology';
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
let isLoading = false;

// نیشاندانی ژمارەی کاڵاکان
document.getElementById('cart-count').innerText = cart.length;

// --- [بەشی نوێ: تۆمارکردنی Service Worker بۆ ئەوەی ببێتە ئەپ] ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log("AutoSteam App Mode: Active");
    });
}

async function fetchData(term, pageNum, isNew = false) {
    if (isLoading) return;
    
    // --- [بەشی نوێ: Caching بۆ خێرایی وەک ئەمازۆن] ---
    const cacheKey = `cache_${term}_${pageNum}`;
    const cachedResponse = sessionStorage.getItem(cacheKey);
    
    if (cachedResponse && !isNew) {
        renderProducts(JSON.parse(cachedResponse), false);
        return;
    }

    isLoading = true;
    document.getElementById('loader').style.display = 'block';

    const url = `https://api.rainforestapi.com/request?api_key=${CONFIG.API_KEY}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(term)}&page=${pageNum}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.search_results) {
            // پاشەکەوتکردنی داتا لە مێشکی بڕاوسەردا بۆ ئەوەی جارێکی تر خێرا بێت
            sessionStorage.setItem(cacheKey, JSON.stringify(data.search_results));
            renderProducts(data.search_results, isNew);
        }
    } catch (error) {
        console.error("Connection slow, retrying...");
    } finally {
        isLoading = false;
        document.getElementById('loader').style.display = 'none';
    }
}

// لێرە هیچ شتێک نەگۆڕدراوە بۆ ئەوەی دیزاینەکەت تێک نەچێت
function renderProducts(items, isNew) {
    const grid = document.getElementById('productGrid');
    const fragment = document.createDocumentFragment(); 

    items.forEach(item => {
        let cleanPrice = item.price ? item.price.value : 25.00;
        let finalPrice = (cleanPrice * CONFIG.PROFIT_MARGIN).toFixed(2);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" onload="this.style.opacity=1" loading="lazy" style="opacity:0">
            <div class="card-info">
                <h4>${item.title.substring(0, 50)}...</h4>
                <div class="price">${finalPrice} USDT</div>
                <button class="add-btn" onclick="addToCart('${item.title.replace(/'/g,"")}', ${finalPrice})">Add to Cart</button>
            </div>`;
        fragment.appendChild(card);
    });

    if (isNew) grid.innerHTML = '';
    grid.appendChild(fragment);
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('myCart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    
    // فیدباکێکی خێرا بۆ کڕیار
    const btn = event.target;
    btn.innerText = "✅ Added";
    setTimeout(() => btn.innerText = "Add to Cart", 1000);
}

function showCart() {
    const list = document.getElementById('cart-items');
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        list.innerHTML += `<div style="font-size:13px; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px; text-align:left;">
            ${index + 1}. ${item.name.substring(0, 35)}... <br><b>${item.price} USDT</b>
        </div>`;
    });
    document.getElementById('total-price').innerText = total.toFixed(2);
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() { document.getElementById('cartModal').style.display = 'none'; }

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    let total = document.getElementById('total-price').innerText;
    let message = `New Order from AutoSteam:%0A%0A`;
    cart.forEach(item => message += `• ${item.name.substring(0,30)}...%0A`);
    message += `%0A*Total: ${total} USDT*%0AWallet: ${CONFIG.WALLET_ADDR}`;
    window.location.href = `https://wa.me/964750XXXXXXX?text=${message}`;
}

function globalSearch() {
    const val = document.getElementById('mainSearch').value;
    if (val.trim() === "") return;
    currentTerm = val;
    page = 1;
    fetchData(currentTerm, page, true);
}

// سکڕۆڵی زیرەک (Infinite Scroll)
window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1200) {
        if (!isLoading) {
            page++;
            fetchData(currentTerm, page);
        }
    }
};

window.onload = () => fetchData(currentTerm, page);
