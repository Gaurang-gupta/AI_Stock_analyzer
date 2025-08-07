import {Timestamp} from "firebase/firestore";

export type RecommendationDataPoint = {
    buy: number;
    hold: number;
    period: string; // or `Date` if you're parsing it into a Date object
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

export type EarningsDatum = {
    actual: number;
    estimate: number;
    period: string; // ISO date string, e.g. "2023-03-31"
    quarter: number;
    surprise: number;
    surprisePercent: number;
    symbol: string;
    year: number;
};

export type Report = {
    id: string;
    title: string;
    stockSymbol: string;
    news_data: string[];
    company_recommendations: RecommendationDataPoint[];
    eps_details: EarningsDatum[];
    short_term_analysis: string[];
    long_term_analysis: string[];
    key_takeaway: string[];
    savedAt: Timestamp;
}

export type IPOData = {
    date: string;
    exchange: string | null;
    name: string;
    numberOfShares: number | null;
    price: string | null;
    status: string;
    symbol: string;
    totalSharesValue: number;
}