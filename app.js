let page = 1;
let currentTerm = 'smart technology';
let loading = false;

async function init(term, isNew = false) {
    if (loading) return;
    loading = true;
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
        let finalPrice = (item.price * CONFIG.PROFIT_MARGIN).toFixed(2);
        let img = item.image.startsWith('//') ? 'https:' + item.image : item.image;
        grid.innerHTML += `
            <div class="card" onclick="openPay('${item.title.replace(/'/g,"")}', '${finalPrice}')">
                <img src="${img}" alt="img">
                <h4>${item.title}</h4>
                <div class="price">$${finalPrice} USDT</div>
                <button style="width:100%; margin-top:10px; cursor:pointer">Contact Supplier</button>
            </div>`;
    });
}

// Infinite Scroll
window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        page++;
        init(currentTerm);
    }
};

function globalSearch() {
    currentTerm = document.getElementById('mainSearch').value;
    page = 1;
    init(currentTerm, true);
}

function openPay(name, price) {
    document.getElementById('pName').innerText = name;
    document.getElementById('pPrice').innerText = price + " USDT";
    document.getElementById('payModal').style.display = 'flex';
}

function closeModal() { document.getElementById('payModal').style.display = 'none'; }

init(currentTerm);
