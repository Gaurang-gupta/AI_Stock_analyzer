"use client";

import { Button } from "@/components/ui/button";
import { RocketIcon, LightbulbIcon, BarChart3Icon } from "lucide-react";
import { motion } from "framer-motion";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import DashboardPage from "@/components/Dashboard";

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        user ? <DashboardPage /> :
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center px-6 py-20 max-w-3xl mx-auto"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    AI-Powered Stock Insights, Instantly.
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl mb-6">
                    Get deep analysis, sentiment breakdowns, SWOT reports, and investment theses using AI.
                </p>
                <Button
                    size="lg"
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    onClick={() => {router.push("/login")}}
                >
                    Get Started For Free
                </Button>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="px-6 py-12 grid md:grid-cols-3 gap-8 text-center max-w-7xl mx-auto"
            >
                <Feature
                    icon={<RocketIcon className="w-8 h-8 mb-2 text-primary" />}
                    title="Instant Reports"
                    description="Get comprehensive insights on any stock in seconds."
                />
                <Feature
                    icon={<LightbulbIcon className="w-8 h-8 mb-2 text-primary" />}
                    title="AI Investment Theses"
                    description="Let Gemini help you make smarter decisions."
                />
                <Feature
                    icon={<BarChart3Icon className="w-8 h-8 mb-2 text-primary" />}
                    title="Sentiment & SWOT"
                    description="Understand risks, opportunities, and market mood."
                />
            </motion.section>

            {/* Call to Action */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-muted px-6 py-12 text-center"
            >
                <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    Start your AI-powered research journey today.
                </h3>
                <Button
                    size="lg"
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    onClick={() => {router.push("/login")}}
                >
                    Try It Free
                </Button>
            </motion.section>

            {/* Footer */}
            <footer className="px-6 py-6 text-center text-sm text-muted-foreground border-t max-w-7xl mx-auto">
                &copy; {new Date().getFullYear()} AI Stock Research. All rights reserved.
            </footer>
        </div>
    );
}

function Feature({
                     icon,
                     title,
                     description,
                 }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center">
            {icon}
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
