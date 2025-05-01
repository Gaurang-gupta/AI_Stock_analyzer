import { db } from "@/lib/firebase"; // your Firebase init file
import {
    collection,
    setDoc,
    doc,
    getDocs,
    deleteDoc,
    serverTimestamp, getDoc,
} from "firebase/firestore";

export async function saveStock(uid: string, stock: { symbol: string; name: string }) {
    const docRef = doc(db, "users", uid, "savedStocks", stock.symbol);
    await setDoc(docRef, {
        ...stock,
        savedAt: serverTimestamp(),
    });
}

export async function unsaveStock(uid: string, symbol: string) {
    const docRef = doc(db, "users", uid, "savedStocks", symbol);
    await deleteDoc(docRef);
}

export async function fetchSavedStocks(uid: string) {
    const snapshot = await getDocs(collection(db, "users", uid, "savedStocks"));
    return snapshot.docs.map((doc) => doc.data());
}

export async function addRecentStock(uid: string, stock: { symbol: string; name: string }) {
    const docRef = doc(db, "users", uid, "recentStocks", stock.symbol);
    await setDoc(docRef, {
        ...stock,
        viewedAt: serverTimestamp(),
    });
}

export async function fetchRecentStocks(uid: string) {
    const snapshot = await getDocs(collection(db, "users", uid, "recentStocks"));
    return snapshot.docs.map((doc) => doc.data());
}

export async function fetchPlan(uid: string) {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.data()
}
