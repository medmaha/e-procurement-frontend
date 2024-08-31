import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import VerificationButton from "./Components/VerificationButton";
import { generate_unique_id } from "@/lib/helpers/generator";
import Page404 from "@/app/not-found";

export const metadata: Metadata = {
	title: "Vendor Certificates | E-Procurement",
	description: "Vendor certificate page",
	keywords:
		"vendors, certificate, registration, annual, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	console.log(user);
	if (!user) return redirect("/account/login?next=/suppliers/certificates");

	const response = await actionRequest<Certificate[]>({
		method: "get",
		url: "/vendors/certificates/",
	});
	if (!response.success) return <Page404 error={response} />;

	const certificates = response.data;
	const permissions = response.auth_perms;

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
						Vendors Certificates
					</h2>
					<p className="text-muted-foreground w-full">
						These certificates will be used by {APP_COMPANY.name} to evaluate
						organization qualification.
					</p>
				</div>
			</div>
			<div className="table-wrapper">
				<table className="table w-full">
					<thead>
						<tr>
							<th>#</th>
							<th>ID</th>
							<th>Vendor</th>
							<th>Name</th>
							<th>File Type</th>
							<th className="w-[15ch]">Verified</th>
							<th>View File</th>
							{permissions.update && <th>Action</th>}
						</tr>
					</thead>
					<tbody>
						{certificates.map((certificate, idx) => {
							return (
								<tr key={certificate.id} className="text-sm">
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>
										<Link
											href={`/suppliers/certificates/${certificate.id}`}
											className="truncate transition link hover:underline underline-offset-4"
										>
											{generate_unique_id("", certificate.id)}
										</Link>
									</td>
									<td>
										<Link
											href={`/suppliers/${certificate.vendor?.id}`}
											className="truncate transition hover:underline underline-offset-4"
										>
											{certificate.vendor?.name}
										</Link>
									</td>
									<td>
										<p className="">{certificate.name}</p>
									</td>
									<td className="uppercase">
										{certificate.type.replace(".", "")}
									</td>
									<td
										className={` ${
											certificate.verified
												? "text-green-500"
												: "text-destructive"
										}`}
									>
										{/* f */}
										<p className="font-semibold w-full">
											{certificate.verified ? "Verified" : "Unverified"}
										</p>
									</td>

									<td>
										<a
											target="_blank"
											href={certificate.file}
											className="ml-4 font-semibold gap-1 link transition hover:underline underline-offset-4"
										>
											View
										</a>
									</td>
									{permissions.update && (
										<td>
											<VerificationButton
												obj_id={certificate.id}
												verified={certificate.verified}
											/>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{certificates.length < 1 && (
				<p className="pt-6 text-sm text-muted-foreground text-center">
					No Data Found!
				</p>
			)}
		</section>
	);
}
