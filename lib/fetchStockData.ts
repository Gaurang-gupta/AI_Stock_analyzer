import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export const fetchStockQuote = async (symbol: string) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/quote`, {
            params: {
                symbol,
                token: API_KEY,
            },
        });
        return data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
    }
};

export const fetchMultipleStockQuotes = async (symbols: string[]) => {
    return await Promise.all(
        symbols.map(async (symbol) => {
            const data = await fetchStockQuote(symbol);
            return {symbol, ...data};
        })
    );
};
