import { format } from "date-fns";
import { CheckCircle2, Info } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { logEntries } from "./types";
import { returnTo } from "@/lib/server/urls";

export const metadata: Metadata = {
	title: "Log Entries | E-Procurement",
	description: "Organization user logs page",
	keywords:
		"authentication, authorization, logs, users, organization, procurement, e-procurement",
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
					<h2 className="heading-text">Log Entries</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						All users within this portal, suppliers user accounts included
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
							<th>User</th>
							<th>Action</th>
							<th>Model</th>
							<th>Model ID</th>
							<th>Type</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{[...logEntries, ...logEntries].map((log, idx) => {
							return (
								<tr key={log.user.email + idx} className="text-sm">
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>0000{log.id}</td>
									<td>{log.user.email}</td>
									<td>{log.action.message}</td>

									<td>{log.object.name}</td>
									<td>{log.object.id}</td>
									<td
										className={`${
											log.action.type === "ADDITION"
												? "text-green-400"
												: log.action.type === "DELETION"
												? "text-destructive"
												: log.action.type === "UPDATE"
												? "text-blue-500"
												: ""
										}  font-semibold text-xs`}
									>
										{log.action.type === "ADDITION" ? (
											"+ "
										) : log.action.type === "DELETION" ? (
											"- "
										) : log.action.type === "UPDATE" ? (
											<>&plusmn; </>
										) : (
											""
										)}
										{log.action.type}
									</td>

									<td>{format(new Date(log.date), "PPPpp")}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
