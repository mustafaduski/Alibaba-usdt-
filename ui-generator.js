function createProductCard(item) {
    const price = Utils.formatPrice(item.price);
    const img = Utils.optimizeImg(item.image);
    
    return `
        <div class="card" onclick="goToDetails('${item.title.replace(/'/g,"")}', '${price}', '${encodeURIComponent(img)}')">
            <div class="badge">Top Rated</div>
            <img src="${img}" loading="lazy"> <div class="card-info">
                <h4>${item.title}</h4>
                <div class="price-row">
                    <span class="currency">$</span>
                    <span class="amount">${price}</span>
                    <span class="unit">USDT</span>
                </div>
                <button class="cart-btn">Add to Cart</button>
            </div>
        </div>`;
}
