import { format } from "date-fns";
import React from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import UpdateContactInformation from "./Components/EditContactPerson";
import VerifyContactDetails from "./Components/VerifyContactDetails";

import { returnTo } from "@/lib/server/urls";
import Page404 from "@/app/not-found";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user)
		return returnTo(
			"/account/login",
			"/vendors/contact-person",
			props.searchParams
		);

	const response = await actionRequest<ContactPerson>({
		method: "get",
		url: "/vendors/contact-person/retrieve/",
	});

	if (!response.success) return <Page404 error={response} />;
	const contactPerson = response.data;

	return (
		<section className="p-6">
			<div className="bg-card rounded-md w-full mx-auto text-card-foreground shadow-md border p-6">
				<div className="py-2 pb-6">
					<h2 className="text-2xl font-bold">Contact Person</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						This is the contact information used by{" "}
						<span className="font-semibold">{APP_COMPANY.name}</span>
						{". "}
						whenever they wish to reach out to you.
					</p>
				</div>
				<table className="table w-full">
					<thead>
						<tr>
							<th>Email Address</th>
							<th>Verified</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Phone Number</th>
							<th>Address</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{contactPerson.email}</td>
							<td>
								<p
									className={`pl-4 ${
										contactPerson.verified
											? "text-green-500"
											: "text-destructive"
									}`}
								>
									{contactPerson.verified ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									)}
								</p>
							</td>
							<td>{contactPerson.first_name}</td>
							<td>{contactPerson.last_name}</td>
							<td>{contactPerson.phone_number}</td>
							<td className="text-xs text-muted-foreground max-w-[20ch] truncate">
								{contactPerson.address?.string ||
									"You have not provide any address info"}
							</td>
						</tr>
					</tbody>
				</table>
				<div className="mt-8 pt-4 border-t flex items-center justify-between gap-6 flex-wrap">
					<div className="flex items-center gap-4">
						<UpdateContactInformation data={contactPerson} />
						{!contactPerson.verified && (
							<VerifyContactDetails data={contactPerson} />
						)}
					</div>
					<p className="text-sm text-muted-foreground inline-flex gap-2">
						<span className="font-semibold">Last Modified Date:</span>
						{format(new Date(contactPerson.last_modified), "PPPp")}
					</p>
				</div>
			</div>
		</section>
	);
}
