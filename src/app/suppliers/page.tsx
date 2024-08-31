import { Check, Loader2 } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Page404 from "@/app/not-found";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { generate_unique_id } from "@/lib/helpers/generator";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Suppliers | E-Procurement",
	description: "Vendors page",
	keywords:
		"vendors, registration, annual, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/suppliers");
	}

	const response = await actionRequest<Vendor[]>({
		method: "get",
		url: "/vendors/",
	});

	if (!response.success) {
		return <Page404 error={response} />;
	}

	const permissions = response.auth_perms;
	const registrations = response.data;

	const isVerified = (vendor: Vendor) => {
		return vendor.verified;
	};

	function rfqByStatus(status: boolean) {
		return registrations?.filter((rfq) => rfq.verified === status) || [];
	}
	const activeRFQ = rfqByStatus(true);
	const inactiveRFQ = rfqByStatus(false);

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
						Suppliers
					</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						All supplier within the platform
					</p>
				</div>
				<div className="grid px-2 pt-1">
					{activeRFQ.length > 0 && (
						<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<span className="inline-flex items-center gap-2">
								<Check size={"16"} className="text-primary" />
								<span className="text-sm">
									<span className="font-bold pr-1">{activeRFQ.length}</span>{" "}
									Verified {pluralize("Supplier", activeRFQ.length)}
								</span>
							</span>
						</p>
					)}
					{inactiveRFQ.length > 0 && (
						<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<span className="inline-flex items-center gap-2">
								<Loader2 size={"16"} className="text-accent-foreground" />
								<span className="text-sm">
									<span className="font-bold pr-1">{inactiveRFQ.length}</span>{" "}
									<span className=" min-w-[20ch]">
										Unverified {pluralize("Supplier", inactiveRFQ.length)}
									</span>
								</span>
							</span>
						</p>
					)}
				</div>
			</div>
			<div className="table-wrapper mt-4">
				<table className="table w-full">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>ID</th>

							<th>Organization</th>
							<th>Status</th>
							<th>Verification</th>
							<th>User Account</th>
							<th>Contact Person</th>
							<th className="w-[15ch] text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{registrations.map((vendor, idx) => {
							return (
								<tr key={vendor.id}>
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>
										<Link
											href={`/suppliers/${vendor.id}`}
											className="truncate transition link hover:underline underline-offset-4"
										>
											{generate_unique_id("", vendor.id)}
										</Link>
									</td>
									<td>
										<Link
											href={`/suppliers/${vendor.id}`}
											className="truncate transition hover:underline underline-offset-4"
										>
											{vendor.organization_name}
										</Link>
									</td>
									<td
										className={`tracking-wide ${
											!vendor.active ? "text-destructive" : "text-green-500"
										}`}
									>
										{vendor.active ? "Active" : "Inactive"}
									</td>
									<td
										className={`tracking-wide ${
											!vendor.verified ? "text-destructive" : "text-green-500"
										}`}
									>
										{vendor.verified ? "Verified" : "Unverified"}
									</td>
									<td className={``}>{vendor.user_account.email}</td>
									<td>
										<Link
											href={`/suppliers/contact-persons/${vendor.contact_person.id}`}
											className="truncate transition hover:underline underline-offset-4"
										>
											{vendor.contact_person.email}
										</Link>
									</td>
									<td>
										<div className="inline-flex justify-center items-center">
											<Button
												size={"sm"}
												className="font-semibold text-xs"
												variant={"secondary"}
											>
												Browse
											</Button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{registrations.length < 1 && (
				<p className="pt-6 text-sm text-muted-foreground text-center">
					No Data Found!
				</p>
			)}
		</section>
	);
}

function pluralize(text: string, item_count: number) {
	return text + (item_count > 1 ? "s" : "");
}
