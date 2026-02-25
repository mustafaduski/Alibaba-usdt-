const apiKey = '8bd9f77f24msh18b6dadd5d8b7f8p17258ajsn5ad908cd38f9';
const apiHost = 'alibaba-datahub.p.rapidapi.com';
let currentPage = 1;
let isFetching = false;

async function fetchProducts(page) {
    if (isFetching) return;
    isFetching = true;
    document.getElementById('loading').style.display = 'block';

    const url = `https://${apiHost}/item_search?q=smart%20home&page=${page}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': apiHost }
        });
        const result = await response.json();
        
        if (result.data && result.data.items) {
            displayItems(result.data.items);
        }
    } catch (error) {
        console.error("API Error:", error);
    } finally {
        isFetching = false;
        document.getElementById('loading').style.display = 'none';
    }
}

function displayItems(items) {
    const grid = document.getElementById('productGrid');
    items.forEach(item => {
        // لێرەدا نرخەکە ١.٥ جار زیاد دەکەین بۆ قازانجی خۆت
        let myPrice = (parseFloat(item.price) * 1.5).toFixed(2);
        
        grid.innerHTML += `
            <div class="card">
                <img src="${item.image}" alt="Product">
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <div class="card-price">$${myPrice}</div>
                    <button class="buy-now" onclick="openOrder('${item.title.replace(/'/g, "")}', '${myPrice}')">Buy with USDT</button>
                </div>
            </div>
        `;
    });
}

// سکڕۆڵی بێ کۆتایی
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 700) {
        currentPage++;
        fetchProducts(currentPage);
    }
};

function openOrder(name, price) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() { document.getElementById('paymentModal').style.display = 'none'; }

function copyAddr() {
    navigator.clipboard.writeText(document.getElementById('walletAddr').innerText);
    alert("Address Copied!");
}

// دەستپێکردن
fetchProducts(currentPage);
