"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app"

export default function AccountPage() {
    const [userEmail, setUserEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const router = useRouter();
    const user = auth.currentUser;

    // username changes
    const [newUserName, setNewUserName] = useState<string>("");

    const fetchUsername = async () => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserName(data.name || "");
            }
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email || "");
                fetchUsername()
            }
        });
        return () => unsubscribe();
    }, [user]);

    const handlePasswordChange = async () => {
        if (!auth.currentUser) {
            toast.error("No user is currently logged in.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            toast.success("Password updated successfully!");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error: unknown) {
            const firebaseError = error as FirebaseError;
            if (firebaseError.code === "auth/requires-recent-login") {
                toast.error("Please reauthenticate to update your password.");
            } else if (firebaseError.code === "auth/weak-password") {
                toast.error("The new password is too weak. Please choose a stronger password.");
            } else {
                toast.error(firebaseError.message || "Failed to update password. Please try again.");
            }
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (auth.currentUser) {
                await auth.currentUser.delete();
                toast("Account deleted.");
                router.push("/")
            }
        } catch (error: any) {
            console.error(error.message);
            toast.error("Error deleting account.");
        }
    };

    const handleUserNameChange = async () => {
        try {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    name: newUserName.trim(),
                });
                toast.success("Username updated successfully");
                setNewUserName("")
                fetchUsername()
            }
        } catch (error) {
            toast.error("Error updating username");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold mt-5">Account Settings</h1>

                {/* Profile Info */}
                <Card className="my-5">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{userName || "No name available"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{userEmail}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Username update */}

                <Card className="mb-5">
                    <CardHeader>
                        <CardTitle>Change Username</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="New Username"
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <Button className="cursor-pointer" onClick={handleUserNameChange}>Update Username</Button>
                    </CardContent>
                </Card>

                {/* Password Update */}
                <Card className="mb-5">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="New password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input
                            placeholder="Confirm new password"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <Button className="cursor-pointer" onClick={handlePasswordChange}>Update Password</Button>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="mb-5">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="destructive" onClick={handleDeleteAccount} className="hover:bg-red-500 cursor-pointer">
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
