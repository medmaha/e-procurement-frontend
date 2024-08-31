import { format } from "date-fns";
import { CheckCircle2, Info } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { Badge } from "@/Components/ui/badge";
import { returnTo } from "@/lib/server/urls";

export const metadata: Metadata = {
	title: "User Accounts | E-Procurement",
	description: "Organization user accounts page",
	keywords:
		"authentication, authorization, accounts, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) {
		return returnTo("/account/login", "/auth-manager/logs", props.searchParams);
	}

	const response = await actionRequest<SystemUsers[]>({
		method: "get",
		url: "/account/users/",
	});

	if (!response.success)
		return (
			<pre>
				<code>{JSON.stringify(response, null, 4)}</code>
			</pre>
		);

	const systemUsers = response.data;

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="heading-text">System Users</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						All users within this portal, suppliers user accounts included
					</p>
				</div>
			</div>
			<div className="table-wrapper">
				<table className="table w-full text-sm">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>Email</th>
							<th>Full Name</th>
							<th>Account Type</th>
							<th>Last Login</th>
							<th>Date Joined</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{systemUsers.map((user, idx) => {
							return (
								<tr key={user.id} className="text-sm">
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>{user.email}</td>
									<td>
										{(user.first_name + " " + (user.middle_name || "")).trim() +
											" " +
											user.last_name}
									</td>

									<td>
										<Badge variant={"outline"} className="uppercase">
											{user.profile_type}
										</Badge>
									</td>
									<td>
										{user.last_login &&
											format(new Date(user.last_login), "PPp")}
									</td>
									<td>{format(new Date(user.created_date), "Pp")}</td>
									<td>
										{user.is_active ? (
											<Badge variant={"success"}>
												<CheckCircle2 width={16} className="text-green-500" />
												<span>Active</span>
											</Badge>
										) : (
											<Badge variant={"destructive"}>
												<Info width={16} className="text-destructive" />
												<span>Inactive</span>
											</Badge>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
