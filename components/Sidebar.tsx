"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Menu } from "lucide-react"; // Icon for hamburger

export default function Sidebar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="max-sm:hidden sm:hidden md:block">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="flex flex-col gap-6 p-6">
                    <SheetTitle className="text-2xl font-bold">StockGenie</SheetTitle>

                    <nav className="flex flex-col gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => {router.push("/"); setOpen(false);}}
                            className={`${
                                pathname === "/" ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {router.push("/settings"); setOpen(false);}}
                            className={`${
                                pathname === "/settings" ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            Account Settings
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {router.push("/billing"); setOpen(false);}}
                            className={`${
                                pathname === "/billing" ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            Billing
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {router.push("/pricing"); setOpen(false);}}
                            className={`${
                                pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            Pricing
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {router.push("/reports"); setOpen(false);}}
                            className={`${
                                pathname === "/reports" ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            Reports
                        </Button>
                    </nav>

                    <Button variant="secondary" className="mt-auto cursor-pointer" onClick={handleLogout}>
                        Logout
                    </Button>
                </SheetContent>
            </Sheet>
        </div>
    );
}
