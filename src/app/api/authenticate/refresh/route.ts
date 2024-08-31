import {
	clearAuthenticationCookies,
	setAuthenticationCookies,
} from "@/lib/auth/actions";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/constants";
import { revalidateAuthenticatedSession } from "@/lib/auth/generics";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL!;

export async function GET(req: NextRequest) {
	const refresh = req.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
	if (refresh) {
		const tokens = await revalidateAuthenticatedSession(refresh!);
		if (tokens) {
			const searchParams = new URL(req.url).searchParams;
			const next = searchParams.get("next");
			const response = NextResponse.json({
				success: true,
				message: "Your session has been refreshed",
				path: next ? next : "/dashboard",
			});
			await setAuthenticationCookies(tokens, response.cookies);
			// revalidatePath("/", "layout");
			return response;
		}
	}
	const response = NextResponse.json({
		success: false,
		message: "Your session has expired",
		path: "/account/login",
	});
	await clearAuthenticationCookies(response.cookies);
	// revalidatePath("/", "layout");
	return response;
}
