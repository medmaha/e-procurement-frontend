"use server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/constants";
import { cookies } from "next/headers";
import { revalidateAuthenticatedSession } from "@/lib/auth/generics";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function authenticateSession() {
	const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value!;
	const data = await revalidateAuthenticatedSession(refreshToken, true);
	if (data) {
		revalidatePath("/account");
		return true;
	}
	return false;
}
export async function redirectTo(pathname: string) {
	return redirect(pathname);
}
