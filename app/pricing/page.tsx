"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Pricing Plans
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-muted-foreground text-lg mb-10"
                >
                    Find the right plan for your investing journey.
                </motion.p>

                {/* Toggle Switch for Billing */}
                <div className="flex items-center gap-4 justify-center mb-8">
                    <span className="text-sm font-medium text-muted-foreground">Monthly</span>

                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary p-1 transition-colors"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isYearly ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>

                    <span className="text-sm font-medium text-muted-foreground">Yearly</span>

                    {/* Show Badge if Yearly is active */}
                    {isYearly && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-2 py-1 text-xs">
                            Save 20%
                        </Badge>
                    )}
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <PricingCard
                        title="Free"
                        price="0"
                        billingPeriod="forever"
                        features={[
                            "Basic stock reports",
                            "Limited AI analysis (5/month)",
                            "Community access",
                        ]}
                        buttonText="Get Started"
                    />
                    <PricingCard
                        title="Pro"
                        price={isYearly ? "15" : "19"}
                        billingPeriod={isYearly ? "per month (billed yearly)" : "per month"}
                        features={[
                            "Unlimited AI reports",
                            "Advanced SWOT analysis",
                            "Investment thesis generation",
                            "Email support",
                        ]}
                        buttonText="Upgrade to Pro"
                        highlight
                    />
                    <PricingCard
                        title="Business"
                        price={isYearly ? "79" : "99"}
                        billingPeriod={isYearly ? "per month (billed yearly)" : "per month"}
                        features={[
                            "Team access (up to 10 users)",
                            "Priority support",
                            "Custom integrations",
                            "Dedicated account manager",
                        ]}
                        buttonText="Contact Sales"
                    />
                </div>
            </div>
        </div>
    );
}

function PricingCard({
                         title,
                         price,
                         billingPeriod,
                         features,
                         buttonText,
                         highlight,
                     }: {
    title: string;
    price: string;
    billingPeriod: string;
    features: string[];
    buttonText: string;
    highlight?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col border rounded-2xl p-8 shadow-sm ${
                highlight
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/30"
            }`}
        >
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-4xl font-bold mb-2">
                ${price}
            </p>
            <p className="text-base text-muted-foreground mb-6">{billingPeriod}</p>
            <ul className="flex-1 space-y-3 mb-6 text-left">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Button
                variant={highlight ? "secondary" : "default"}
                className="cursor-pointer w-full transition-all hover:scale-105"
            >
                {buttonText}
            </Button>
        </motion.div>
    );
}
