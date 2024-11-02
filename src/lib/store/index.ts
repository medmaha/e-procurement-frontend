"use client"
import { create } from "zustand";

interface PageState {
  title: string;
  description?: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  reset: () => void;
}

export const usePageStore = create<PageState>((set) => ({
  title: "",
  description: undefined,
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  reset: () => set({ title: "", description: undefined }),
}));
