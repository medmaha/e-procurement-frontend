"use client";
import { Moon, Sun } from "lucide-react";
import { useOptimistic, useState } from "react";
import SubmitButton from "../widget/SubmitButton";
import { toggleTheme } from "./actions";
import { Button } from "../ui/button";

type Theme = "light" | "dark" | "system";

export default function ThemeSwitcher({ theme: t }: any) {
  const [theme, updateTheme] = useOptimistic((t ?? "system") as Theme);

  async function toggle() {
    const cacheTheme = String(theme) as Theme;
    const newTheme = cacheTheme === "dark" ? "light" : "dark";
    updateTheme(newTheme);
    document.querySelector("html")?.classList.replace(cacheTheme, newTheme);
    try {
      await toggleTheme(newTheme);
    } catch (error) {
      updateTheme(cacheTheme);
      document.querySelector("html")?.classList.replace(newTheme, cacheTheme);
    }
  }
  return (
    <form action={toggle} className="cursor-pointer">
      <Button
        variant={"ghost"}
        className="disabled:opacity-70 disabled:pointer-events-none h-max p-0 pt-1 hover:bg-transparent"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </form>
  );
  return null;
}
