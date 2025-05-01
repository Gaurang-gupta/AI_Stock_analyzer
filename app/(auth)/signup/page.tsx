"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

    const handleDocumentCreation = async(user: User) => {
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
            console.log("User document created successfully!");
        }

        toast.success("Successfully created user! Redirecting...");
        router.push("/");
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long.");
            toast.error("Password should be at least 6 characters long.")
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleDocumentCreation(userCredential.user)
        } catch (err) {
            console.log(err)
            setError("Something went wrong");
            toast.error("Something went wrong");
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
            await handleDocumentCreation(userCredential.user)
        } catch (err) {
            console.log(err)
            setError("Google Sign-up failed");
            toast.error("Google Sign-up failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">Sign Up</h1>

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

                <form onSubmit={handleSignup} className="space-y-4">
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
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>

                <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/login" className="hover:underline">
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
