async function getAlibabaData(query, page = 1) {
    const url = `https://api.rainforestapi.com/request?api_key=${CONFIG.API_KEY}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(query)}&page=${page}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        // ڕێکخستنی داتای ئەمازۆن بۆ ناو سایتەکەت
        if (result.search_results && result.search_results.length > 0) {
            return {
                data: {
                    items: result.search_results.map(item => ({
                        title: item.title,
                        price: item.price ? item.price.value : "25.00", // ئەگەر نرخ نەبوو، نرخێکی وەهمی دادەنێت
                        image: item.image
                    }))
                }
            };
        }
        return null;
    } catch (error) {
        console.error("Rainforest Error:", error);
        return null;
    }
}
