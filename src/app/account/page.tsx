import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/auth/constants";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";
import { Loader2 } from "lucide-react";
import { convertUrlSearchParamsToSearchString } from "@/lib/helpers";
import { decodeJWTTokens, validateAndDecodeJWT } from "@/lib/auth/generics";
import Auth from "./Components/Auth";

export default function page(props: PageProps) {
	const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;
	const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;
	const queryString = convertUrlSearchParamsToSearchString(props.searchParams);

	// const returnToDashboard = () => {
	// 	const nextPage = props.searchParams.next;
	// 	const user = validateAndDecodeJWT(accessToken)?.user!;
	// 	let dashboard =
	// 		nextPage ||
	// 		(user?.profile_type === "Vendor" ? "/dashboard/vendor" : "/dashboard");
	// 	return redirect(dashboard);
	// };

	// if (accessToken) {
	// 	return returnToDashboard();
	// }
	// if (!refreshToken) {
	// 	return redirect("/account/login" + queryString);
	// }

	return (
		<section className="section">
			<div className="pt-[50px] sm:pt-[100px] w-full flex items-start justify-center">
				<div className="w-max p-4 flex flex-col gap-2 items-center">
					<Auth></Auth>
				</div>
			</div>
		</section>
	);
}
