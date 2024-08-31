import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import ViewContactPerson from "./Components/ViewContactPerson";
import Link from "next/link";
import { generate_unique_id } from "@/lib/helpers/generator";

export const metadata: Metadata = {
	title: "Vendor Contact Persons | E-Procurement",
	description: "Vendor contact persons page",
	keywords:
		"vendors, contacts, persons, registration, annual, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) return redirect("/account/login/");

	const response = await actionRequest<ContactPerson[]>({
		method: "get",
		url: "/vendors/contact-person/",
	});

	if (!response.success) return null;

	const contactPersons = response.data;

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
						Contact Person
					</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						This is the contact information used by{" "}
						<span className="font-semibold">{APP_COMPANY.name}</span>
						{". "}
						whenever they wish to reach out to you.
					</p>
				</div>
			</div>
			<div className="table-wrapper">
				<table className="table w-full">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>ID</th>
							<th>Organization</th>
							<th>Email Address</th>
							<th>Verification</th>
							<th>Full Name</th>
							<th>Phone Number</th>
							<th className="w-[8ch]">
								<span className="inline-block w-full text-center">Action</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{contactPersons.map((person, idx) => {
							return (
								<tr key={person.id || person.email}>
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>
										<Link
											href={`/suppliers/contact-persons/${person.id}`}
											className="truncate transition link hover:underline underline-offset-4"
										>
											{generate_unique_id("", person.id)}
										</Link>
									</td>
									<td>
										<Link
											href={`/suppliers/${person.vendor.id}`}
											className="truncate transition hover:underline underline-offset-4"
										>
											{person.vendor.name}
										</Link>
									</td>
									<td>{person.email}</td>
									<td
										className={`${
											!person.verified ? "text-destructive" : "text-green-500"
										}`}
									>
										{person.verified ? "Verified" : "Unverified"}
									</td>
									<td>{person.first_name + " " + person.last_name}</td>
									<td>{person.phone_number}</td>
									<td>
										<div className="inline-flex items-center justify-center w-full">
											<ViewContactPerson data={person} />
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{contactPersons.length < 1 && (
				<p className="pt-6 text-sm text-muted-foreground text-center">
					No Data Found!
				</p>
			)}
		</section>
	);
}
