// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {auth, db} from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner"
import { sendPasswordResetEmail } from "firebase/auth";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.push("/"); // Redirect if logged in
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user
            if(!user) return new Error("User is not created.");

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || "", // if you collect name separately you can add
                    createdAt: serverTimestamp(),
                    plan: "free", // Default plan
                    credits: 0,
                });
                await setDoc(doc(db, "users", user.uid, "savedStocks", "initial"), {});
                await setDoc(doc(db, "users", user.uid, "recentStocks", "initial"), {});
                await setDoc(doc(db, "users", user.uid, "reports", "initial"), {});
                console.log("User document created successfully!");
            }

            toast.success("Successfully logged in! Redirecting...");
            router.push("/");
        } catch (err) {
            setError("Google Sign-in failed");
            toast.error("Google Sign-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">Login</h1>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        Continue with Google
                    </Button>
                    <div className="flex items-center space-x-2">
                        <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">or</p>
                        <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-sm text-muted-foreground hover:underline">
                                Forgot password?
                            </button>
                        </DialogTrigger>

                        <ForgotPasswordModal />
                    </Dialog>
                    <Link href="/signup" className="hover:underline">
                        New here? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ForgotPasswordModal() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent. Check your inbox!");
            setEmail("");
        } catch (error) {
            toast.error("Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reset your password</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    disabled={loading}
                />
            </div>

            <DialogFooter className="mt-4">
                <Button onClick={handleResetPassword} disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Email"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
