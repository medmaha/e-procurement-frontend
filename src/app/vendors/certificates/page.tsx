import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import CreateOrUpdateCertificate from "./Components/AddCertificate";

// import UpdateContactInformation from './Components/EditContactPerson';

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) return redirect("/account/login/");

	const response = await actionRequest<Certificate[]>({
		method: "get",
		url: "/vendors/certificates/",
	});
	if (!response.success) return <Page404 error={response} />;

	const certificates = response.data;
	return (
		<section className="p-6">
			<div className="bg-card rounded-md max-w-[1200px] w-full mx-auto text-card-foreground shadow-md border p-6">
				<div className="py-2 pb-6">
					<h2 className="text-2xl font-bold">Your Certificates</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						These certificates will be used by {APP_COMPANY.name} to evaluate
						your organization qualification.
					</p>
				</div>
				<div className="table-wrapper">
					<table className="table w-full">
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Type</th>
								<th>Date Achieved</th>
								<th className="w-[15ch]">Verified</th>

								<th>View File</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{certificates.map((certificate, idx) => {
								return (
									<tr key={certificate.id} className="text-sm">
										<td>
											<small>{idx + 1}.</small>
										</td>
										<td>{certificate.name}</td>
										<td className="uppercase">
											{certificate.type.replace(".", "")}
										</td>
										<td>
											{format(new Date(certificate.date_achieved), "PPP")}
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
												className="font-semibold pl-4 gap-1 link transition hover:underline underline-offset-4"
											>
												View
											</a>
										</td>
										<td>
											<CreateOrUpdateCertificate data={certificate}>
												<Button
													className="font-semibold text-xs"
													variant={"secondary"}
													size={"sm"}
												>
													Update
												</Button>
											</CreateOrUpdateCertificate>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{!certificates.length && (
					<p className="text-sm pb-4 text-muted-foreground text-center">
						No Certificates Found
					</p>
				)}
				<div className="pt-4 border-t flex items-center justify-between gap-6 flex-wrap">
					<CreateOrUpdateCertificate data={{}} />
					{certificates.length > 0 && (
						<p className="text-sm text-muted-foreground inline-flex gap-2">
							<span className="font-semibold">Last Modified Date:</span>
							{format(new Date(certificates[0]?.last_modified), "PPPp")}
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
