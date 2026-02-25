let page = 1;
let currentTerm = 'smart technology'; // گەڕانی سەرەتایی کاتێک سایتەکە دەکرێتەوە
let loading = false;

// فەنکشنی سەرەکی بۆ دەستپێکردن و هێنانی داتا
async function init(term, isNew = false) {
    if (loading) return;
    loading = true;
    
    // پیشاندانی لۆدەر (Loading)
    const loader = document.getElementById('scrollTrigger');
    if(loader) loader.style.display = 'block';

    const data = await getAlibabaData(term, page);
    
    if (data && data.data && data.data.items) {
        renderItems(data.data.items, isNew);
    } else {
        console.error("No data found from API");
    }
    
    loading = false;
    if(loader) loader.style.display = 'none';
}

// دروستکردنی کارتەکان لەسەر شاشە
function renderItems(items, isNew) {
    const grid = document.getElementById('productGrid');
    if (isNew) grid.innerHTML = ''; // ئەگەر گەڕانێکی نوێ بێت، لیستی کۆن پاک بکەرەوە

    items.forEach(item => {
        // حیسابکردنی نرخ لەگەڵ قازانج بەپێی ئەوەی لە config.js دامانناوە
        let finalPrice = (parseFloat(item.price) * CONFIG.PROFIT_MARGIN).toFixed(2);
        
        // چاککردنی وێنەکان
        let img = item.image;
        if (img.startsWith('//')) img = 'https:' + img;

        grid.innerHTML += `
            <div class="card" onclick="goToDetails('${item.title.replace(/'/g,"")}', '${finalPrice}', '${encodeURIComponent(img)}')">
                <img src="${img}" alt="Product" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <div class="price">$${finalPrice} USDT</div>
                    <button class="view-btn">View Details</button>
                </div>
            </div>`;
    });
}

// ناردنی کڕیار بۆ لاپەڕەی وردەکاری (Details)
function goToDetails(name, price, img) {
    window.location.href = `details.html?name=${encodeURIComponent(name)}&price=${price}&img=${img}`;
}

// مەکینەی گەڕانی جیهانی (Global Search)
function globalSearch() {
    const searchVal = document.getElementById('mainSearch').value;
    if (searchVal.trim() !== "") {
        currentTerm = searchVal;
        page = 1;
        init(currentTerm, true);
    }
}

// سیستەمی سکڕۆڵی بێ کۆتایی (Infinite Scroll)
window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        if (!loading) {
            page++;
            init(currentTerm);
        }
    }
};

// دەستپێکردنی ئۆتۆماتیکی
init(currentTerm);
