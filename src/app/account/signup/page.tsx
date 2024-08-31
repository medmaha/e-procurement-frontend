import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import SignupProcess from "./Components/SignupProcess";
import Vendor from "./Vendor";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (user) {
		const userType = user?.profile_type;
		if (userType === "Vendor") redirect("/dashboard/vendor");
		redirect("/dashboard");
	}

	const searchParams = props.searchParams;

	if (typeof searchParams.register === "string") {
		return (
			<section className="section">
				<SignupProcess>
					<LoginLink />
				</SignupProcess>
			</section>
		);
	}

	return (
		<section className="section">
			<Vendor>
				<LoginLink />
			</Vendor>
		</section>
	);
}

function LoginLink() {
	return (
		<div className="pt-4">
			<p className="text-center text-sm">
				Already have an account?
				<Link
					href="/account/login"
					className="link transition hover:underline underline-offset-4 font-bold px-2"
				>
					Login Now
				</Link>
			</p>
			<div className="min-h-5 block w-full opacity-0"></div>
		</div>
	);
}
