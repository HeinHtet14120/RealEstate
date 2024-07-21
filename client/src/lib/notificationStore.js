import { create } from 'zustand'
import apiRequest from "./apiRequest.js"

export const useNotificationStore = create((set) => ({
    number: 0,
    fetch: async () => {
        const res = await apiRequest("/user/notification");
        set({ number: res.data });

        console.log("this is res : ", res.data)
    },

    decrease: () => {
        set((prev) => ({ number: prev.number - 1 }));
    },

    reset: () => {
        set({ number: 0});
    }
}));