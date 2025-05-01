// lib/gemini/generateStockAnalysis.ts
"use server"
import {google} from '@ai-sdk/google';
import {generateObject} from 'ai';
import {z} from "zod"
import axios from 'axios';
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase";

export const getCompanyNews = async (symbol: string) => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY; // Replace with your actual API key

    const today = new Date();
    const priorDate = new Date(today);
    priorDate.setDate(today.getDate() - 7); // Last 7 days

    const formatDate = (date: Date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const url = `https://finnhub.io/api/v1/company-news`;
    const params = {
        symbol,
        from: formatDate(priorDate),
        to: formatDate(today),
        token: apiKey,
    };

    try {
        const response = await axios.get(url, { params });
        // return response.data; // Array of news objects
        return response.data.slice(0, Math.min(response.data.length, 15)).map((x: {
            category: string;
            datetime: number;
            headline: string;
            id: number;
            image: string;
            related: string;
            source: string;
            summary: string;
            url: string;
        }) => (
            x.headline + " " + x.summary + "\n"
        ));
    } catch (error) {
        console.error("Error fetching company news:", error);
        return [];
    }
};


export const generateStockAnalysis = async ({
                                                stockSymbol,
                                                userId
                                            }: {
    stockSymbol: string;
    userId: string;
}) => {
    try {
        const news = await getCompanyNews(stockSymbol);
        const prompt = `
      Analyze the stock ${stockSymbol} with the following details:
      - news: \n ${news}

       Provide a short-term and long-term analysis in a points. Always make sure to give me these points. 
      
       - **Title**
       - **Given Data**
       - **Short term analysis**
       - **Long term analysis**
       - **Key Takeaway**
       
       Give me a json object with these fields.
    `;

        const {object: {title, given_data, short_term_analysis, long_term_analysis, key_takeaway}} = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: z.object({
                title: z.string(),
                given_data: z.array(z.string()),
                short_term_analysis: z.array(z.string()),
                long_term_analysis: z.array(z.string()),
                key_takeaway: z.array(z.string()),
            }),
            prompt: prompt,
            system: "You are a professional wealth manager"
        });

        const analysis = {
            title: title,
            given_data: given_data,
            short_term_analysis:short_term_analysis,
            long_term_analysis: long_term_analysis,
            key_takeaway: key_takeaway,
        }

        // Save the generated report to Firestore
        await saveReport(userId!, stockSymbol, analysis);

        return analysis;
    } catch (error) {
        console.error("Error generating stock analysis:", error);
    }
};


export const saveReport = async (userId: string, stockSymbol: string, analysis: {
    title: string;
    given_data: string[];
    short_term_analysis: string[];
    long_term_analysis: string[];
    key_takeaway: string[];
}) => {
    try {
        const docRef = doc(db, "users", userId, "reports", stockSymbol);
        await setDoc(docRef, {
            savedAt: serverTimestamp(),
            stockSymbol,
            title: analysis.title,
            given_data: analysis.given_data,
            short_term_analysis: analysis.short_term_analysis,
            long_term_analysis: analysis.long_term_analysis,
            key_takeaway: analysis.key_takeaway,
        });
    } catch (error) {
        console.error("Error saving report:", error);
    }
};

