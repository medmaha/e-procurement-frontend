import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { actionRequest } from "@/lib/utils/actionRequest";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";

export const metadata: Metadata = {
	title: "Procurement Thresholds | E-Procurement",
	description: "Procurement methods threshold staff page",
	keywords: "staffs, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return returnTo(
			"/account/login",
			"/organization/plans/thresholds",
			props.searchParams
		);
	}

	const searchString = searchParamsToSearchString(props.searchParams);
	const response = await actionRequest<Threshold[]>({
		method: "get",
		url: "/organization/plans/thresholds/" + searchString,
	});

	if (!response.success) {
		return <Page404 error={response} />;
	}

	const thresholds = response.data;
	const permissions = response.auth_perms;

	return (
		<section className="section">
			<div className="section-heading">
				<h1 className="heading-text">Procurement Method Thresholds</h1>
			</div>
			<div className="table-wrapper">
				<table className="table w-full text-sm">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>Method</th>
							<th>Min Amount</th>
							<th>Max Amount</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{thresholds.map((threshold, idx) => {
							return (
								<tr key={threshold.id}>
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td className="uppercase">
										<span className="uppercase tracking-wider">
											{threshold.procurement_method.replace(/[_]/gi, " ")}
										</span>
									</td>
									<td>D{formatNumberAsCurrency(threshold.min_amount)}</td>
									<td>D{formatNumberAsCurrency(threshold.max_amount)}</td>
									<td>
										<p className="text-muted-foreground text-sm">
											{threshold.description}
										</p>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="text-right">
				<p className="text-muted-foreground justify-end font-semibold w-max text-sm mt-5 text-right pr-8 inline-flex items-center gap-5">
					<span>Total Thresholds:</span>
					<span>{thresholds.length}</span>
				</p>
			</div>
		</section>
	);
}

interface Threshold {
	id: ID;
	procurement_method: string;
	min_amount: string | number;
	max_amount: string | number;
	description: string;
}
