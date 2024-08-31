import { format, formatDistance } from "date-fns";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { Badge } from "@/Components/ui/badge";
import CreateRFQResponse from "./Components/CreateRFQResponse";
import BrowseQuotation from "./Components/ViewQuotation";
import { returnTo } from "@/lib/server/urls";
import APP_COMPANY from "@/APP_COMPANY";

export default async function page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) {
		return returnTo(
			"/account/login",
			"/vendors/rfq-requests",
			props.searchParams
		);
	}
	const response = await actionRequest<RFQRequest[]>({
		method: "get",
		url: "/vendors/rfq-requests/",
	});

	if (!response.success) {
		return <Page404 error={response} />;
	}
	const rfqRequests = response.data;
	function quotesByStatus(responded: boolean) {
		return rfqRequests.filter((rfq) => rfq.responded === responded);
	}

	const pendingRFQRequest = quotesByStatus(false);
	// const rejectedQuotes = quotesByStatus("REJECTED");

	const canRespondToRFQ = (quotation: RFQRequest) => {
		return quotation.responded === false && quotation.open_status === true;
	};

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h1 className="heading-text">RFQ Invitations</h1>
					<p className="heading-desc">
						All Invitations for RFQ FORM-101 issued by <b>{APP_COMPANY.name}</b>
					</p>
				</div>
				<div className="grid px-2 pt-1">
					{pendingRFQRequest.length > 0 && (
						<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<span className="inline-flex items-center gap-4">
								<Loader2 size={"16"} className="text-primary" />
								<span className="text-xs">
									Pending{" "}
									<span className="font-bold">{pendingRFQRequest.length}</span>{" "}
									{pluralize("Invitation", pendingRFQRequest.length)}
								</span>
							</span>
						</p>
					)}
				</div>
			</div>
			<div className="table-wrapper">
				<table className="table w-full text-sm">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>RFQ ID</th>
							<th>Description</th>
							<th>Issued At</th>
							<th>Deadline</th>
							<th>Status</th>
							<th>My Response</th>
							<th>Form 101</th>
							<th className="">Action</th>
						</tr>
					</thead>
					<tbody className="text-xs">
						{rfqRequests?.map((rfq, idx) => {
							return (
								<tr key={rfq.unique_id}>
									<td className="relative">
										<small>{idx + 1}.</small>
										{rfq.is_new && (
											<span className="inline-block bg-primary text-primary-foreground rounded text-xs h-max w-max absolute right-0 top-0">
												new
											</span>
										)}
									</td>
									<td>{rfq.unique_id}</td>
									<td className="w-max">
										<p className="truncate max-w-[25ch]">{rfq.title}</p>
									</td>
									<td>{format(new Date(rfq.created_date), "PP")}</td>
									<td>
										{formatDistance(new Date(rfq.deadline), new Date(), {
											addSuffix: true,
										})}
									</td>
									<td>
										{rfq.open_status ? (
											<Badge variant={"success"}>Open</Badge>
										) : (
											<Badge variant={"destructive"}>Close</Badge>
										)}
									</td>

									<td className={`font-normal`}>
										{rfq.my_response === "accepted" ? (
											<>
												<Badge variant={"success"}>
													<CheckCircle2 className="" width={14} height={14} />
													<span>Submitted</span>
												</Badge>
											</>
										) : rfq.my_response === "pending" ? (
											<Badge variant={"outline"}>
												<Loader2 width={14} height={14} />
												Pending
											</Badge>
										) : (
											<>
												<Badge variant={"destructive"}>
													<XCircle width={14} height={14} />
													Declined
												</Badge>
											</>
										)}
									</td>
									<td>
										<Link
											href={`/form-101?m=rfq-request&i=${rfq.id}`}
											className="inline-block link text-sm font-semibold underline-offset-4 hover:underline transition"
										>
											View File
										</Link>
									</td>

									<td>
										<div className="inline-flex w-full items-center gap-1 text-sm">
											<BrowseQuotation
												data={rfq}
												user={user}
												autoFocus={false}
											/>
											{canRespondToRFQ(rfq) && (
												<CreateRFQResponse
													data={rfq}
													user={user}
													autoFocus={false}
												/>
											)}
										</div>
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

function pluralize(text: string, item_count: number) {
	return text + (item_count > 1 ? "s" : "");
}
