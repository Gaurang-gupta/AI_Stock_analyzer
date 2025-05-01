import { Card, CardContent } from "@/components/ui/card"
const GeminiCard = ({ title, given_data, short_term_analysis, long_term_analysis, key_takeaway, stockSymbol, savedAt }: {
    title: string;
    given_data: string[];
    short_term_analysis: string[];
    long_term_analysis: string[];
    key_takeaway: string[];
    savedAt?: string;
    stockSymbol?: string;
}) => {
    return (
        <Card>
            <CardContent className="space-y-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                {stockSymbol != null && stockSymbol != "" && savedAt != null && savedAt != "" && <p className="text-sm mb-4">
                    Stock Symbol: {stockSymbol} |{" "}
                    {savedAt}
                </p>}

                {/* Given Data */}
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">📊 Given Data</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {given_data.map((item, index) => (
                            <li key={index} className="font-medium">{item}</li>
                        ))}
                    </div>
                </div>

                {/* Short Term Analysis */}
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">⏱️ Short-Term Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {short_term_analysis.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>

                {/* Long Term Analysis */}
                <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-2">🧭 Long-Term Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {long_term_analysis.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>

                {/* Key Takeaway */}
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl text-sm text-yellow-800">
                    {/*<strong>📌 Key Takeaway:</strong> {report.Key_Takeaway}*/}
                    <h3 className="font-semibold text-lg mb-2">📌 Key Takeaway:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {key_takeaway.map((point: string, idx: number) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default GeminiCard;