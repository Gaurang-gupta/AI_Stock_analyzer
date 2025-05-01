"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
                <Skeleton className="w-[300px] h-[200px]" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] p-6">
            <div className="max-w-6xl mx-auto flex flex-col">
                <h1 className="text-3xl font-semibold mb-6 mt-5">Billing</h1>
                <div className="w-full space-y-6">
                    {/* Current Plan Card */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-medium">Free</p>
                                    <p className="text-sm text-muted-foreground">You are currently on the free plan.</p>
                                </div>

                                {/* Upgrade button */}
                                <Button variant="default" onClick={() => router.push("/pricing")}>
                                    Upgrade
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing History Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                No billing history yet.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
