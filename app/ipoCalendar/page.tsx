// components/IpoTable.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {useEffect, useState} from "react";
import {getIPOCalendar} from "@/lib/gemini/generateStockAnalysis"; // Assuming you have shadcn's utility function
import { IPOData } from "@/types";

export default function IpoTable() {
    // Helper function to format currency
    const [data, setData] = useState<IPOData[]>([]);
    useEffect(() => {
        const fetchIpoData = async() => {
            const x = await getIPOCalendar()
            setData(x.ipoCalendar)
        }
        fetchIpoData()
    }, []);
    const formatCurrency = (value: number) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((item, index) => (
                    <Card key={index} className="shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    {item.name}
                                </CardTitle>
                                <Badge
                                    className={cn(
                                        'capitalize',
                                        item.status === 'priced'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : item.status === "withdrawn"
                                                ? "bg-red-500 hover:bg-red-600"
                                                : item.status === "expected"
                                                    ?"bg-blue-500 hover:bg-blue-600"
                                                    :'bg-yellow-500 hover:bg-yellow-600'
                                    )}
                                >
                                    {item.status}
                                </Badge>
                            </div>
                            <CardDescription>{item.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-gray-500">Symbol</p>
                                <p className="font-medium">{item.symbol || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Exchange</p>
                                <p className="font-medium">{item.exchange || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Value</p>
                                <p className="font-medium">{formatCurrency(item.totalSharesValue)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}