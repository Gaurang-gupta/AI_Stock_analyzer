"use client"
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path based on your project
import { useAuth } from "@/context/AuthContext";
import GeminiCard from "@/components/GeminiCard"; // Custom hook or however you're handling auth
import { Timestamp } from "firebase/firestore"

interface RecommendationDataPoint {
    buy: number;
    hold: number;
    period: string; // or `Date` if you're parsing it into a Date object
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

interface Report {
    id: string;
    title: string;
    stockSymbol: string;
    news_data: string[];
    company_recommendations: RecommendationDataPoint[];
    short_term_analysis: string[];
    long_term_analysis: string[];
    key_takeaway: string[];
    savedAt: Timestamp;
}

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Assume this gives you { uid: "..." }

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;

            const reportsRef = collection(db, "users", user.uid, "reports");
            const q = query(reportsRef, orderBy("savedAt", "desc"));
            const snapshot = await getDocs(q);

            const data: Report[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Report[];

            setReports(data);
            setLoading(false);
        };

        fetchReports();
    }, [user]);

    if (loading) return <p className="text-center mt-8">Loading reports...</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Saved Reports</h1>

            {reports.length === 0 ? (
                <p>No reports saved yet.</p>
            ) : (
                <div className="space-y-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="shadow-md rounded-2xl p-6 border border-gray-200"
                        >
                            <GeminiCard
                                title={report.title}
                                news_data={report.news_data}
                                company_recommendations={report.company_recommendations}
                                short_term_analysis={report.short_term_analysis}
                                long_term_analysis={report.long_term_analysis}
                                key_takeaway={report.key_takeaway}
                                savedAt={report.savedAt?.toDate().toLocaleString()}
                                stockSymbol={report.stockSymbol}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
