import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { generate_unique_id } from "@/lib/helpers/generator";
import { ContactPersonDetails } from "../Components/ViewContactPerson";
import Link from "next/link";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/procurement/rfq");
	}

	const slug = props.params.slug;
	const response = await actionRequest<ContactPerson>({
		method: "get",
		url: "/vendors/contact-person/" + slug + "/",
	});

	if (!response.success) return <Page404 error={response} />;

	const contactPerson = response.data;

	return (
		<>
			<section className="section">
				<div className="section-heading">
					<div className="grid items-start justify-start">
						<div className="pb-1">
							<GoBack />
						</div>
						<p className="text-sm font-semibold text-muted-foreground inline-flex items-center gap-2">
							<span>Verification Status:</span>
							{contactPerson.verified ? (
								<span className=" inline-flex items-center gap-1">
									<CheckCircle2
										className="text-green-500"
										width={16}
										height={16}
									/>
									<small className="text-green-500">VERIFIED</small>
								</span>
							) : (
								<span className=" inline-flex items-center gap-1">
									<XCircle
										className="text-destructive"
										width={16}
										height={16}
									/>
									<small className="text-destructive">UNVERIFIED</small>
								</span>
							)}
						</p>
					</div>
					<div className="">
						<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
							Supplier Contact Person{" "}
							<span className="text-muted-foreground">
								{generate_unique_id("", contactPerson.id)}
							</span>{" "}
							Details
						</h1>
						<p className="text-sm text-muted-foreground pt-1.5">
							Date Joined:{" "}
							<span className="font-semibold">
								{format(new Date(contactPerson.created_date), "PPPPp")}
							</span>
						</p>
					</div>
				</div>
				<div className="section-content flex flex-wrap gap-4 md:gap-6 justify-between items-center">
					<h3 className="font-semibold text-xl">
						<Link
							href={`/suppliers/${contactPerson.vendor.id}`}
							className="link inline-flex transition font-semibold hover:underline underline-offset-4"
						>
							{contactPerson.vendor.name}
						</Link>
						{" | "} <span>Contact Person</span>
					</h3>
				</div>
				<div className="section-content">
					<ContactPersonDetails data={contactPerson} />
				</div>
			</section>
		</>
	);
}
