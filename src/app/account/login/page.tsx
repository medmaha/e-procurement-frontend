import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import Form from "./Form";
import { searchParamsToSearchString } from "@/lib/server/urls";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (user) {
		const next = props.searchParams.next;

		console.log(next);
		console.log(searchParamsToSearchString(props.searchParams));

		if (next) return redirect(next);
		const url =
			user.profile_type === "Vendor" ? "/dashboard/vendor" : "/dashboard";
		return redirect(url);
	}

	return (
		<section className="section">
			<div className="pt-20" id="login">
				<div className="block w-full max-w-[600px] sm:p-6 p-4 mx-auto bg-card text-card-foreground shadow rounded-md border-2">
					<div className="text-center pb-6">
						<h2 className="font-bold text-2xl">E-Procurement Portal</h2>
						<p className="text-sm">
							Welcome back! Sign in using your credentials
						</p>
					</div>

					<Form />
				</div>
				<div className="pt-8">
					<p className="text-center text-sm">
						Don&apos;t have an account yet?
						<Link
							href="/account/signup"
							className="px-2  font-bold transition hover:underline link underline-offset-4"
						>
							Signup now
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
