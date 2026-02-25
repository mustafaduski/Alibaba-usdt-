const apiKey = '8bd9f77f24msh18b6dadd5d8b7f8p17258ajsn5ad908cd38f9';
const apiHost = 'alibaba-datahub.p.rapidapi.com';
let currentPage = 1;
let currentSearch = 'smart home'; // گەڕانی سەرەتایی
let isFetching = false;

// هێنانی بەرهەمەکان
async function loadProducts(query, page) {
    if (isFetching) return;
    isFetching = true;
    document.getElementById('loader').style.display = 'block';

    const url = `https://${apiHost}/item_search?q=${encodeURIComponent(query)}&page=${page}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': apiHost }
        });
        const result = await response.json();
        
        if (result.data && result.data.items) {
            renderItems(result.data.items);
        }
    } catch (err) {
        console.error("Connection Failed:", err);
    } finally {
        isFetching = false;
        document.getElementById('loader').style.display = 'none';
    }
}

function renderItems(items) {
    const grid = document.getElementById('productGrid');
    items.forEach(item => {
        // قازانجی ٥٠٪
        let finalPrice = (parseFloat(item.price) * 1.5).toFixed(2);
        
        // چاککردنی وێنەکان (هەندێک وێنە بە // دەستپێدەکەن)
        let imgUrl = item.image;
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

        grid.innerHTML += `
            <div class="card">
                <img src="${imgUrl}" alt="Product" onerror="this.src='https://placehold.co/400x400?text=Product+Image'">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <div class="card-price">$${finalPrice}</div>
                    <button class="buy-btn" onclick="openPayment('${item.title.replace(/'/g, "")}', '${finalPrice}')">Buy Now with USDT</button>
                </div>
            </div>
        `;
    });
}

// فەنکشنی گەڕان
function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== "") {
        document.getElementById('productGrid').innerHTML = ''; // پاککردنەوەی پەیجەکە
        currentPage = 1;
        currentSearch = query;
        loadProducts(currentSearch, currentPage);
    }
}

document.getElementById('searchBtn').onclick = performSearch;

// سکڕۆڵی بێ کۆتایی
window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 900) {
        currentPage++;
        loadProducts(currentSearch, currentPage);
    }
};

function openPayment(name, price) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() { document.getElementById('paymentModal').style.display = 'none'; }

function copyAddr() {
    navigator.clipboard.writeText("TVWRheHD5zVeXeF3jnWpZrVunaTGLZza3i");
    alert("USDT Address Copied!");
}

// دەستپێکردن
loadProducts(currentSearch, currentPage);
