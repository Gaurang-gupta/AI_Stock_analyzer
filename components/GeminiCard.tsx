import { Card, CardContent } from "@/components/ui/card"
import RecommendationChart from "@/components/RecommendationChart";
interface RecommendationDataPoint {
    buy: number;
    hold: number;
    period: string; // or `Date` if you're parsing it into a Date object
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}
const GeminiCard = (
    {
        title,
        news_data,
        company_recommendations,
        short_term_analysis,
        long_term_analysis,
        key_takeaway,
        stockSymbol,
        savedAt
    }: {
        title: string;
        news_data: string[];
        company_recommendations: RecommendationDataPoint[];
        short_term_analysis: string[];
        long_term_analysis: string[];
        key_takeaway: string[];
        savedAt?: string;
        stockSymbol?: string;
}) => {
    console.log(company_recommendations);
    return (
        <Card>
            {/* if no analysis is present */}
            {news_data.length === 0 && short_term_analysis.length === 0 && long_term_analysis.length === 0 &&
                key_takeaway.length === 0 ?
                <p className="text-center">
                    Gemini insights will appear here after you analyze a stock.
                </p>
            :
            <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                {stockSymbol != null && stockSymbol != "" && savedAt != null && savedAt != "" && <p className="text-sm mb-4">
                    Stock Symbol: {stockSymbol} |{" "}
                    {savedAt}
                </p>}



                {/* News Data */}
                {news_data.length > 0 &&
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">📊 Given Data</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {news_data.map((item, index) => (
                            <li key={index} className="font-medium">{item}</li>
                        ))}
                    </div>
                </div>
                }

                {/* Financial Data */}
                {/*<FinancialChart data={company_financials}/>*/}
                {/* Recommendation Chart */}
                {company_recommendations != null && company_recommendations.length === 0 &&
                <RecommendationChart data={company_recommendations}/>
                }

                {/* Short Term Analysis */}
                {short_term_analysis != null && short_term_analysis.length > 0 &&
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">⏱️ Short-Term Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {short_term_analysis.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>
                }

                {/* Long Term Analysis */}
                {long_term_analysis != null && long_term_analysis.length > 0 &&
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">🧭 Long-Term Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {long_term_analysis.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>
                }

                {/* Key Takeaway */}
                { key_takeaway != null && key_takeaway.length > 0 &&
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl text-sm text-yellow-800">
                    <h3 className="font-semibold text-lg mb-2">📌 Key Takeaway:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {key_takeaway.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>
                }
            </CardContent>
            }
        </Card>
    )
}

export default GeminiCard;