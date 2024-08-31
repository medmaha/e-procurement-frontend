import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "./lib/auth/generics";
import { urlToNextPath } from "./lib/helpers/actions";

const BASE_URL = process.env.BASE_URL;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
	// const pathname = request.nextUrl.pathname;

	// // Getting the authenticated user
	// const user = await getAuthenticatedUser();

	// // Checking if the user is authenticated
	// if (!user) {
	// 	// If the user is not authenticated, redirect to the login page
	// 	if (request.url === request.nextUrl.href) return NextResponse.next();

	// 	// Skipping the middleware for the following routes (login, signup)
	// 	const ACCOUNTS_ROUTES = /^\/(account)/gi;
	// 	if (ACCOUNTS_ROUTES.test(pathname)) {
	// 		return NextResponse.next();
	// 	}
	// 	const next = urlToNextPath(request.nextUrl.href);
	// 	return NextResponse.redirect(BASE_URL + "/account/login" + next);
	// }

	// // Getting the profile type of user e.g (Staff, Vendor)
	// const profile_type = user?.profile_type;

	// // Defining the forbidden routes for the opposite profile type
	// const STAFF_ROUTES = /^\/(procurement|organization|suppliers|auth-manager)/gi;
	// const VENDOR_ROUTES = /^\/(vendors)/gi;

	// let response: NextResponse;

	// // Checking if the user is authorized to access the route
	// // Redirecting the user to the appropriate dashboard page based on the profile type
	// if (profile_type === "Staff" && VENDOR_ROUTES.test(pathname))
	// 	response = NextResponse.redirect(BASE_URL + "/dashboard");
	// if (profile_type === "Vendor" && STAFF_ROUTES.test(pathname))
	// 	response = NextResponse.redirect(BASE_URL + "/dashboard/vendor");

	// // If the user is authenticated and authorized, continue to the next middleware
	// response = NextResponse.next();
	// return response;

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
