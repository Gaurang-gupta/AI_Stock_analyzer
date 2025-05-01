"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {signOut, User} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner"
import Image from "next/image"

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { loading } = useAuth();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null); // Track logged-in user state
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/"); // Redirect to homepage after logout
        } catch (error) {
            console.error("Error logging out: ", error);
            toast.error("Error logging out!");
        }
    };

    return (
        <header className="w-full border-b bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

                {isLoggedIn && <Sidebar isLoggedIn={isLoggedIn}/>}
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    StockGenie
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {!isLoggedIn &&
                    <Link href="/pricing" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                        pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
                    }`}>
                        Pricing
                    </Link>
                    }
                    <ModeToggle />
                    <div>
                        {isLoggedIn && ((user?.photoURL !== null && user?.photoURL !== "") ?
                            <Image
                                src={user?.photoURL!}
                                alt={"User image"}
                                height={40}
                                width={40}
                                className="rounded-full cursor-pointer"
                            />:
                            <div className="text-lg bg-purple-600 px-3 py-1 rounded-full cursor-pointer">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>)
                        }
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    <ModeToggle />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>

                    <div>
                        {isLoggedIn && ((user?.photoURL !== null && user?.photoURL !== "") ?
                            <Image
                                src={user?.photoURL!}
                                alt={"User image"}
                                height={40}
                                width={40}
                                className="rounded-full cursor-pointer"
                            />:
                            <div className="text-lg bg-purple-600 px-3 py-1 rounded-full cursor-pointer">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>)
                        }
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 pb-6">
                    {isLoggedIn &&
                        <>
                            <Link href="/" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                                pathname === "/" ? "text-primary" : "text-muted-foreground"
                            }`}>
                                Dashboard
                            </Link>

                            <Link href="/settings" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                                pathname === "/settings" ? "text-primary" : "text-muted-foreground"
                            }`}>
                                Account Settings
                            </Link>

                            <Link href="/billing" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                                pathname === "/billing" ? "text-primary" : "text-muted-foreground"
                            }`}>
                                Billing
                            </Link>
                        </>
                    }

                    <Link href="/pricing" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                        pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
                    }`}>
                        Pricing
                    </Link>

                    {isLoggedIn && <Link href="/reports" onClick={() => setMenuOpen(false)} className={`text-sm font-medium ${
                        pathname === "/reports" ? "text-primary" : "text-muted-foreground"
                    }`}>
                        Reports
                    </Link>}

                    {!loading && (
                        user && (
                            <Button onClick={handleLogout} variant="secondary" className="cursor-pointer">
                                Logout
                            </Button>
                        )
                    )}
                </div>
            )}
        </header>
    );
}
