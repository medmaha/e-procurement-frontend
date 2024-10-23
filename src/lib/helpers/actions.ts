"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { convertUrlSearchParamsToSearchString } from "./transformations";

export async function retryPage(pathname: string) {
	return revalidatePath(pathname);
}

/**
 * Converts the next query parameter to a pathname e.g https://example.com/?next=/path
 * @param {string} href the base url
 * @param {boolean} withPathname if false returns only the query string e.g. ?next=/path
 */
export const urlToNextPath = (href?: string, withPathname = true) => {
	const referer = href || headers().get("referer");
	if (referer) {
		try {
			const url = new URL(referer);
			const pathname = url.pathname;
			const next = url.searchParams.get("next");


			if (next === pathname) return "";

			return `?next=${next}`;

			if (pathname && pathname !== "/") {
				const searchParams = new URLSearchParams(url.search);
				const queryString = convertUrlSearchParamsToSearchString(
					Object.fromEntries(searchParams.entries())
				);

				const _next =
					(withPathname ? pathname : "" + queryString)
						.match(/\?next=\/((\w{0,}\/)*\w{0,})$/gi)
						?.at(-1) || "";
			}
		} catch (error) {}
	}
	return "";
};
