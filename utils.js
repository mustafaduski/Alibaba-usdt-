const Utils = {
    // چاککردنی نرخەکان و زیادکردنی قازانج
    formatPrice: (price) => {
        let p = parseFloat(price) || 0;
        return (p * CONFIG.PROFIT_MARGIN).toFixed(2);
    },
    // دڵنیابوونەوە لە وێنەکان
    optimizeImg: (url) => {
        if (!url) return 'https://placehold.co/400x400?text=No+Image';
        return url.startsWith('//') ? 'https:' + url : url;
    }
};
