import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            setLoggedIn: (token) => set({ isLoggedIn: true, token }),
            logout: () => set({ isLoggedIn: false, token: null }),
        }),
        { name: "fluxguard-auth" }
    )
);