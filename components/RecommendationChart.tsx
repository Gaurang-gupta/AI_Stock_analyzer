"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecommendationDataPoint {
    buy: number;
    hold: number;
    period: string; // or `Date` if you're parsing it into a Date object
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

const RecommendationChart = ({ data, title }: { data: RecommendationDataPoint[], title:string }) => {
    const formattedData = data.map((entry) => ({
        period: entry.period,
        "Strong Buy": entry.strongBuy,
        Buy: entry.buy,
        Hold: entry.hold,
        Sell: entry.sell,
        "Strong Sell": entry.strongSell,
    }));

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <CardTitle>Analyst Recommendations - {title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Strong Buy" stackId="a" fill="#16a34a" />
                        <Bar dataKey="Buy" stackId="a" fill="#4ade80" />
                        <Bar dataKey="Hold" stackId="a" fill="#facc15" />
                        <Bar dataKey="Sell" stackId="a" fill="#f97316" />
                        <Bar dataKey="Strong Sell" stackId="a" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default RecommendationChart;
