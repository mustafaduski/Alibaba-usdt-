let page = 1;
let currentTerm = 'electronics'; 
let loading = false;

async function init(term, isNew = false) {
    if (loading) return;
    loading = true;
    
    const grid = document.getElementById('productGrid');
    const loader = document.getElementById('scrollTrigger');
    
    if (isNew) grid.innerHTML = '<p style="padding:20px">Searching...</p>';
    if (loader) loader.innerText = "Connecting to Alibaba...";

    try {
        const data = await getAlibabaData(term, page);
        
        if (data && data.data && data.data.items && data.data.items.length > 0) {
            renderItems(data.data.items, isNew);
            if (loader) loader.innerText = "Scroll for more";
        } else {
            if (loader) loader.innerText = "No products found. Try another search.";
        }
    } catch (err) {
        if (loader) loader.innerText = "Error: Check your API Key limit.";
    } finally {
        loading = false;
    }
}

function renderItems(items, isNew) {
    const grid = document.getElementById('productGrid');
    if (isNew) grid.innerHTML = '';

    items.forEach(item => {
        let finalPrice = (parseFloat(item.price || 0) * CONFIG.PROFIT_MARGIN).toFixed(2);
        let img = item.image || 'https://placehold.co/400x400?text=No+Image';
        if (img.startsWith('//')) img = 'https:' + img;

        grid.innerHTML += `
            <div class="card" onclick="goToDetails('${item.title.replace(/'/g,"")}', '${finalPrice}', '${encodeURIComponent(img)}')">
                <img src="${img}" alt="Product">
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
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 800) {
        if (!loading) {
            page++;
            init(currentTerm);
        }
    }
};

// دەستپێکردن کاتێک پەیجەکە لۆد دەبێت
window.onload = () => init(currentTerm);
