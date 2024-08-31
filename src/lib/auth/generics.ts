import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from "./constants";
import {
	clearAuthenticationCookies,
	setAuthenticationCookies,
} from "./actions";
import CACHE from "../caching";

interface Payload extends JwtPayload {
	user: AuthUser;
}

/**
 * Retrieves the authenticated user's information based on the stored JWT tokens.
 * It validates and decodes the JWT for both the access token (`sid`) and the refresh token (`session`).
 * If either token is not valid, it returns null indicating no authenticated user.
 */
export async function getAuthenticatedUser() {
	const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;
	const user = validateAndDecodeJWT(accessToken)?.user || null;
	return user;
}

export async function decodeJWTTokens(token: Tokens) {
	const access = validateAndDecodeJWT(token.access)!;
	const refresh = validateAndDecodeJWT(token.refresh)!;
	return { access, refresh };
}

export function validateAndDecodeJWT(token?: string) {
	if (!token) return null;
	try {
		const value: Payload = jwtDecode(token);
		return value;
	} catch (error) {
		return null;
	}
}

const controller = new AbortController();

export async function revalidateAuthenticatedSession(
	session: string,
	setCookie = false
) {
	const refreshUrl = `${process.env.BACKEND_URL}/account/session/`;
	try {
		if (CACHE.has("revalidateAuthenticatedSession")) controller.abort();
		CACHE.set("revalidateAuthenticatedSession", true, 5);
		const { data } = await axios.post<Tokens>(
			refreshUrl,
			{ refresh: session },
			{ signal: controller.signal }
		);
		if (setCookie) {
			setAuthenticationCookies(data);
		}
		return data;
	} catch (error: any) {
		if (setCookie) {
			clearAuthenticationCookies();
		}
		return null;
	}
}
