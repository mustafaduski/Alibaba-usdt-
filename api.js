async function getAlibabaData(query, page = 1) {
    const url = `https://${CONFIG.API_HOST}/item_search?q=${encodeURIComponent(query)}&page=${page}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-RapidAPI-Key': CONFIG.API_KEY, 'X-RapidAPI-Host': CONFIG.API_HOST }
        });
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}
