"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    fetchSavedStocks,
    fetchRecentStocks,
    saveStock,
    addRecentStock,
    fetchPlan
} from "@/lib/firebase/stocks";
import { StockCard } from "@/components/StockCard";
import {fetchMultipleStockQuotes, fetchStockQuote} from "@/lib/fetchStockData";
import {collection, DocumentData, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { toast } from "sonner"
import {generateStockAnalysis} from "@/lib/gemini/generateStockAnalysis";
import GeminiCard from "@/components/GeminiCard";

interface RecommendationDataPoint {
    buy: number;
    hold: number;
    period: string; // or `Date` if you're parsing it into a Date object
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [symbol, setSymbol] = useState("")
    const [stockName, setStockName] = useState("")
    const [savedStocks, setSavedStocks] = useState<DocumentData[]>([])
    const [recentStocks, setRecentStocks] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPlan,  setCurrentPlan] = useState<{name: string, renewalDate: string}>({name: "", renewalDate: ""});
    const [analysis, setAnalysis] = useState<{
        title: string;
        news_data: string[];
        company_financials: object[];
        company_recommendations: RecommendationDataPoint[];
        short_term_analysis: string[];
        long_term_analysis: string[];
        key_takeaway: string[];
    }>({
        title: "",
        news_data: [],
        company_financials: [],
        company_recommendations: [],
        short_term_analysis: [],
        long_term_analysis: [],
        key_takeaway: [],
    });

    useEffect(() => {
        const fetchStocks = async () => {
            if (user) {
                try {
                    const saved = await fetchSavedStocks(user.uid);
                    const recent = await fetchRecentStocks(user.uid);
                    setSavedStocks(saved);
                    setRecentStocks(recent);
                } catch (error) {
                    console.error("Error fetching stocks", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const plans = async() => {
            if(user) {
                const plan = await fetchPlan(user.uid)
                if(plan) {
                    const current = {
                        name: plan.plan!,
                        renewalDate: 'upgrade to unlock more features',
                    }
                    setCurrentPlan(current)
                }
            }
        }

        fetchStocks();
        plans();
    }, [user]);

    // Save stock handler
    const handleSave = async (stock: { symbol: string; name: string }) => {
        if (user && symbol.length > 1 && stockName.length > 0) {
            const data = await fetchStockQuote(symbol)
            if(data !== null) {
                await saveStock(user.uid, stock);
                getSavedStocks()
            }
            else {
                toast.error("Stock not saved!");
            }
            setSymbol("")
            setStockName("")
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const getSavedStocks = async () => {
        if (!user) return;
        console.log("Getting saved stocks");
        const snap = await getDocs(collection(db, `users/${user.uid}/savedStocks`));
        const symbols = snap.docs.map((doc) => doc.data().symbol);
        const quotes = await fetchMultipleStockQuotes(symbols);
        setSavedStocks(quotes);
    };

    const getRecentStocks = async () => {
        if (!user) return;
        console.log("Getting recent stocks");
        const snap = await getDocs(collection(db, `users/${user.uid}/recentStocks`));
        const symbols = snap.docs.map((doc) => doc.data().symbol);
        const quotes = await fetchMultipleStockQuotes(symbols);
        setRecentStocks(quotes);
    };

    useEffect(() => {
        getSavedStocks();
        getRecentStocks();
    }, [user]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    const handleAnalyze = async () => {
        if (!symbol || !stockName || !user) return;

        try {
            setLoading(true);
            setAnalysis({
                title: "",
                news_data: [],
                company_financials: [],
                company_recommendations: [],
                short_term_analysis: [],
                long_term_analysis: [],
                key_takeaway: [],
            }); // Clear old result
            const quote = await fetchStockQuote(symbol);

            if (!quote) {
                toast.error("Stock data not found.");
                return;
            }
            const result = await generateStockAnalysis({
                stockSymbol: symbol,
                userId: user.uid,
            });

            if(result !== undefined) setAnalysis(result);
            await addRecentStock(user.uid, { symbol, name: stockName });
            getRecentStocks();
            toast.success("Analysis complete and saved.");
        } catch (err) {
            toast.error("Failed to generate analysis.");
            console.error(err);
        } finally {
            setLoading(false);
            setSymbol("")
            setStockName("")
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>

            {/* Plan Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-medium">{currentPlan.name} Plan</p>
                        {currentPlan.name != "free" && <p className="text-sm text-muted-foreground">
                            Renews on {currentPlan?.renewalDate}
                        </p>}
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/pricing")}
                        className='cursor-pointer'
                    >
                        Manage
                    </Button>
                </CardContent>
            </Card>

            {/* Stock Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Search for a Stock</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row">
                    <Input
                        placeholder="Enter stock symbol (e.g. AAPL, TSLA)"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    />
                    <Input
                        placeholder="Enter stock name (e.g. Apple, Tesla)"
                        value={stockName}
                        onChange={(e) => setStockName(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => handleSave({ symbol: symbol, name: stockName })}
                            className='cursor-pointer'
                        >
                            Save
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Gemini AI Output */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gemini AI Analysis</CardTitle>
                    <Button className="cursor-pointer" onClick={handleAnalyze} disabled={loading}>
                        {loading ? "Analyzing..." : "Analyze"}
                    </Button>
                </CardHeader>
                <CardContent className="text-muted-foreground whitespace-pre-wrap">
                    {analysis
                        ? <GeminiCard
                            title={analysis.title}
                            news_data={analysis.news_data}
                            company_recommendations={analysis.company_recommendations}
                            short_term_analysis={analysis.short_term_analysis}
                            long_term_analysis={analysis.long_term_analysis}
                            key_takeaway={analysis.key_takeaway}
                        />
                        : "Gemini insights will appear here after you analyze a stock."}
                </CardContent>
            </Card>

            {/* Saved Stocks */}
            <Card>
                <CardHeader>
                    <CardTitle>Saved Stocks</CardTitle>
                </CardHeader>
                <CardContent>
                    {savedStocks.length > 0 ? (
                        <ul className="list-disc list-inside grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {savedStocks.map((stock) => (
                                <StockCard
                                    key={stock.symbol}
                                    symbol={stock.symbol}
                                    currentPrice={stock.c}
                                    high={stock.h}
                                    low={stock.l}
                                    prevClose={stock.pc}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">You haven&apos;t saved any stocks yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* Recently Viewed */}
            <Card>
                <CardHeader>
                    <CardTitle>Recently Viewed</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentStocks.length > 0 ? (
                        <ul className="list-disc list-inside grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {recentStocks.map((stock) => (
                                <StockCard
                                    key={stock.symbol}
                                    symbol={stock.symbol}
                                    currentPrice={stock.c}
                                    high={stock.h}
                                    low={stock.l}
                                    prevClose={stock.pc}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">No recently viewed stocks yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
