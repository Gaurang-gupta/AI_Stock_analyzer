"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Bar,
    Line,
} from "recharts";

type EarningsDatum = {
    actual: number;
    estimate: number;
    period: string; // ISO date string, e.g. "2023-03-31"
    quarter: number;
    surprise: number;
    surprisePercent: number;
    symbol: string;
    year: number;
};
import { useTheme } from "next-themes";
export default function EarningsChart({
                                          eps_details,
                                          title
                                      }: {
    eps_details: EarningsDatum[];
    title: string;
}) {
    const { resolvedTheme } = useTheme();
    const barColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

    return (
        <Card className="rounded-2xl shadow-md p-4">
            <CardHeader>
                <CardTitle className="text-xl font-semibold dark:text-white">
                    {title} EPS vs Estimates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={eps_details}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="period"
                                tickFormatter={(value: string) =>
                                    new Date(value).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "2-digit",
                                    })
                                }
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(val: number) => val.toFixed(2)}
                                labelFormatter={(label: string) =>
                                    `Period: ${new Date(label).toLocaleDateString("en-US")}`
                                }
                            />
                            <Legend />
                            <Bar
                                dataKey="actual"
                                name="Actual EPS"
                                barSize={30}
                                radius={[4, 4, 0, 0]}
                                fill={barColor}
                            />
                            <Line
                                type="monotone"
                                dataKey="estimate"
                                name="Estimate EPS"
                                strokeWidth={3}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
