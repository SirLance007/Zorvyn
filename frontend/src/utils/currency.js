// Conversion rate: 1 USD = ~83.5 INR (update as needed)
const USD_TO_INR = 83.5;

export const formatCurrency = (amount, currency = 'USD') => {
    const num = parseFloat(amount) || 0;
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(num * USD_TO_INR);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(num);
};

export const formatCurrencyCompact = (amount, currency = 'USD') => {
    const num = parseFloat(amount) || 0;
    const converted = currency === 'INR' ? num * USD_TO_INR : num;
    const symbol = currency === 'INR' ? '₹' : '$';
    if (converted >= 100000) return `${symbol}${(converted / 100000).toFixed(1)}L`;
    if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(1)}k`;
    return `${symbol}${converted.toFixed(2)}`;
};

export { USD_TO_INR };
