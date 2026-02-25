let page = 1;
let currentTerm = 'gadgets'; 
let loading = false;

async function init(term, isNew = false) {
    if (loading) return;
    loading = true;
    
    const grid = document.getElementById('productGrid');
    if (isNew) grid.innerHTML = '<p>Searching Amazon...</p>';

    const data = await getAlibabaData(term, page);
    
    if (data && data.data.items) {
        renderItems(data.data.items, isNew);
    }
    loading = false;
}

function renderItems(items, isNew) {
    const grid = document.getElementById('productGrid');
    if (isNew) grid.innerHTML = '';

    items.forEach(item => {
        let finalPrice = (parseFloat(item.price) * CONFIG.PROFIT_MARGIN).toFixed(2);
        grid.innerHTML += `
            <div class="card" onclick="goToDetails('${item.title.replace(/'/g,"")}', '${finalPrice}', '${encodeURIComponent(item.image)}')">
                <img src="${item.image}" alt="Product">
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <div class="price">$${finalPrice} USDT</div>
                    <button class="view-btn">View Details</button>
                </div>
            </div>`;
    });
}

function goToDetails(name, price, img) {
    window.location.href = `details.html?name=${encodeURIComponent(name)}&price=${price}&img=${img}`;
}

function globalSearch() {
    const searchVal = document.getElementById('mainSearch').value;
    if (searchVal.trim() !== "") {
        currentTerm = searchVal;
        page = 1;
        init(currentTerm, true);
    }
}

window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        if (!loading) {
            page++;
            init(currentTerm);
        }
    }
};

window.onload = () => init(currentTerm);
