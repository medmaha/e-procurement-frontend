"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from "./constants";
import { decodeJWTTokens } from "./generics";

export async function clearAuthenticationCookies(defaultCookie?: any) {
	const _c = defaultCookie ?? cookies();
	_c.delete(ACCESS_TOKEN_COOKIE_NAME);
	_c.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export async function logoutAuthUser(pathname?: string) {
	await clearAuthenticationCookies();
	if (pathname) revalidatePath(pathname, "layout");
	return {
		message: "You have been logged out successfully",
	};
}

export async function setAuthenticationCookies(
	tokens: Tokens,
	defaultCookie?: any
) {
	const { access, refresh } = tokens;

	const decodedTokens: any = await decodeJWTTokens(tokens);

	// TODO: set secure cookies with ssl (https)
	const secureCookie = false; // process.env.NODE_ENV === "production";

	const maxAge1 = decodedTokens?.access?.exp - decodedTokens?.access?.iat;

	const cookie = defaultCookie || cookies();
	cookie.set(ACCESS_TOKEN_COOKIE_NAME, access, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		secure: secureCookie,
		maxAge: maxAge1,
	});

	// TODO : set secure cookies with ssl (https)
	// const maxAge2 = decodedTokens?.refresh?.exp - decodedTokens?.refresh?.iat;
	// cookie.set(REFRESH_TOKEN_COOKIE_NAME, refresh, {
	// 	path: "/",
	// 	httpOnly: true,
	// 	sameSite: "strict",
	// 	secure: secureCookie,
	// 	maxAge: maxAge2,
	// });
}
