import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import React from 'react';
import Page404 from '@/app/not-found';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { getAuthenticatedUser } from '@/lib/auth/generics';
import { actionRequest } from '@/lib/utils/actionRequest';
import Description from './Components/Description';


export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/vendors/organization");
	}

	let url = "/vendors/retrieve/";

	if (props.searchParams.oid) {
		url += "?oid=" + props.searchParams.oid;
	}

	const response = await actionRequest({
		method: "get",
		url: url,
	});

	if (!response.success) return <Page404 error={response} />;

	const vendor = response.data;
	const permissions = response.auth_perms;
	return (
		<section className="p-6">
			<div className="p-4 rounded bg-card text-card-foreground shadow border mb-6">
				<div className="flex justify-between items-center">
					<div className="">
						<h2 className="font-bold text-2xl">{vendor.organization_name}</h2>

						<div className="">
							<Description
								text={vendor.description || "No description provided."}
							></Description>
						</div>
					</div>
					{permissions.update && (
						<div className="">
							<Button className="font-semibold text-lg">Update</Button>
						</div>
					)}
				</div>
			</div>
			<div className="p-4 rounded bg-card text-card-foreground shadow border mb-6">
				<div className="grid grid-cols-4 gap-4 gap-y-8">
					<div className="grid">
						<p>Registration Type</p>
						<p className="text-muted-foreground">{vendor.registration_type}</p>
					</div>
					<div className="grid">
						<p>Registration Number</p>
						<p className="text-muted-foreground">
							{vendor.registration_number}
						</p>
					</div>
					<div className="grid">
						<p>VAT</p>
						<p className="text-muted-foreground">{vendor.vat_number}</p>
					</div>
					<div className="grid">
						<p>TIN</p>
						<p className="text-muted-foreground">{vendor.tin_number}</p>
					</div>
					<div className="grid">
						<p>license_number</p>
						<p className="text-muted-foreground">{vendor.license_number}</p>
					</div>
					<div className="grid">
						<p>Website</p>
						<p className="text-muted-foreground">{vendor.website ?? "N/A"}</p>
					</div>
					<div className="grid">
						<p>Industry</p>
						<p className="text-muted-foreground capitalize">
							{vendor.industry ?? "N/A"}
						</p>
					</div>
					<div className="grid">
						<p>Established Date</p>
						<p className="text-muted-foreground">
							{vendor.established_date
								? format(new Date(vendor.established_date), "PPP")
								: "N/A"}
						</p>
					</div>
				</div>
			</div>
			<div className="p-4 rounded bg-card text-card-foreground shadow border mb-6">
				<div className="grid grid-cols-3 gap-4 gap-y-8">
					<div className="grid">
						<p>Contact Person</p>
						<p className="text-muted-foreground">
							{vendor.contact_person.email}
						</p>
					</div>
					<div className="grid">
						<p>User Account</p>
						<p className="text-muted-foreground">{vendor.user_account.email}</p>
					</div>
					<div className="grid pointer-events-none">
						<p>Activation Status</p>
						<p className="inline-flex items-center gap-4 pointer-events-none">
							<Switch
								defaultChecked={vendor.active}
								className="pointer-events-none"
							/>
							<span
								className={
									"font-semibold " +
									(vendor.active ? "link" : "text-destructive")
								}
							>
								{vendor.active ? "Active" : "Inactive"}
							</span>
						</p>
					</div>
					<div className="grid col-span-3">
						<p>Certificates</p>
						<p className="text-muted-foreground text-sm">
							{vendor.certificates?.map((cert: any, i: number) => {
								return (
									<span
										key={cert.id}
										className="hover:underline underline-offset-1 transition inline-block pr-4"
									>
										<small>{i + 1}.</small> {cert.name}
										{i < vendor.certificates?.length - 1 && ", "}
									</span>
								);
							})}
							{!vendor.certificates?.length && "No Certificates"}
						</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between gap-6 flex-wrap">
				{permissions.update && (
					<Button className="font-semibold text-lg">Update Information</Button>
				)}
				<p className="text-sm text-muted-foreground inline-flex gap-2">
					<span className="font-semibold">Last Modified Date:</span>
					{format(new Date(vendor.last_modified), "PPPp")}
				</p>
			</div>
		</section>
	);
}
