"use server";
import { cookies } from "next/headers";

type Theme = "light" | "dark" | "system";

export async function toggleTheme(newTheme: Theme) {
	if (["light", "dark", "system"].includes(newTheme)) {
		cookies().set("theme", newTheme);
		return true;
	}
	throw new Error("Invalid theme");
}
