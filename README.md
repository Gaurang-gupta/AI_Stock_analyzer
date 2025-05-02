This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🧠 AI-Powered Stock Research Assistant
A web application that provides in-depth, AI-generated stock analysis using real-time financial data and company news. Built with Next.js, Firebase, and Gemini API, this project helps users make informed investment decisions effortlessly.

## 🚀 Features
🔍 Stock Search: Enter a stock symbol (e.g., AAPL, MSFT) to fetch live price and change percentage.

📈 AI Analysis: Uses the Gemini model to generate:

Short-term market sentiment
Long-term company outlook
Key investment takeaways

📰 Company News Integration: Fetches recent news using the Finnhub API for context-aware analysis.
🔐 User Authentication: Secure login and password management using Firebase Authentication.
💾 Save Reports: Save generated reports to your personal account with timestamps.
🗂️ Reports Dashboard: View and delete past stock analyses from your reports page.

## 🛠️ Tech Stack
Frontend: React, Next.js, Tailwind CSS
Backend: Firebase Firestore & Auth, Gemini AI (Google Generative AI)
APIs:
Finnhub (for company news)
Gemini (for AI stock analysis)

## 🔐 Authentication & Security
Firebase Auth is used to manage user sessions securely.
Firestore rules restrict users to accessing only their own data.



## Getting Started

1. Clone the repo
git clone [https://github.com/your-username/ai-stock-research.git](https://github.com/Gaurang-gupta/AI_Stock_analyzer.git)
cd ai-stock-research

2. npm install
3. Create a .env.local file with your credentials
4. run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🧑‍💻 Author
Built with 💡 by Gaurang Gupta (Projects with Gaurang)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
