import {
	clearAuthenticationCookies,
	setAuthenticationCookies,
} from "@/lib/auth/actions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { session } = await req.json();

	const searchParam = new URLSearchParams(req.url);

	if (searchParam.get("refresh") && session) {
		try {
			const { data } = await axios.post<Tokens>(
				process.env.BACKEND_URL + "/account/session/",
				{ refresh: session }
			);
			await setAuthenticationCookies(data);
			return NextResponse.json(data, { status: 200, headers: {} });
		} catch (error) {
			await clearAuthenticationCookies();
			return NextResponse.json({}, { status: 400, headers: {} });
		}
	}
	return NextResponse.json({}, { status: 400 });
}
