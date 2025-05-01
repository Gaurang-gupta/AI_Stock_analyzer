"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StockCardProps {
    symbol: string;
    currentPrice: number;
    high: number;
    low: number;
    prevClose: number;
}

export const StockCard = ({
                              symbol,
                              currentPrice,
                              high,
                              low,
                              prevClose,
                          }: StockCardProps) => {
    const priceChange = currentPrice - prevClose;
    const changeColor = priceChange >= 0 ? "text-green-500" : "text-red-500";

    return (
        <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{symbol}</h2>
                <p className="text-muted-foreground">Current Price: ${currentPrice?.toFixed(2)}</p>
                <p className={`${changeColor}`}>
                    {priceChange >= 0 ? "▲" : "▼"} {priceChange.toFixed(2)}
                </p>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>High: ${high}</span>
                    <span>Low: ${low}</span>
                </div>
            </CardContent>
        </Card>
    );
};
