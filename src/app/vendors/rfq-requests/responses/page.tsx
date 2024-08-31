import { format, formatDistance } from "date-fns";
import { Check, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import BrowseRFQResponse from "../Components/BrowseRFQResponse";
import Page404 from "@/app/not-found";
import { Badge } from "@/Components/ui/badge";

export default async function page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/account/login?next=/vendors/rfq-requests/responses");
	}

	const response = await actionRequest<RFQResponse[]>({
		method: "get",
		url: "/vendors/rfq-responses/",
	});

	if (!response.success) return <Page404 error={response} />;

	const rfqResponses = response.data;
	function quotesByStatus(status: RFQResponse["approved_status"]) {
		return rfqResponses.filter(
			(response) => response.approved_status === status
		);
	}

	const acceptedQuotes = quotesByStatus("ACCEPTED");
	const rejectedQuotes = quotesByStatus("REJECTED");
	const pendingQuoteResponse = quotesByStatus("PROCESSING");

	return (
		<section className="p-6">
			<div className="p-6 rounded-lg shadow border bg-card text-card-foreground mb-8">
				<div className="flex justify-between items-center flex-wrap gap-4">
					<h1 className="text-xl sm:text-3xl font-bold">
						RFQ Response Tracking
					</h1>
					<div className="grid px-2 pt-1">
						{acceptedQuotes.length > 0 && (
							<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
								<span className="inline-flex items-center gap-2.5">
									<Check size={"16"} className="text-primary" />
									<span className="text-xs">
										<span className="font-bold">{acceptedQuotes.length}</span>{" "}
										Accepted {pluralize("Quotation", acceptedQuotes.length)}
									</span>
								</span>
							</p>
						)}
						{rejectedQuotes.length > 0 && (
							<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
								<span className="inline-flex items-center gap-2.5">
									<Info size={"16"} className="text-destructive" />
									<span className="text-xs">
										<span className="font-bold">{rejectedQuotes.length}</span>{" "}
										<span className=" min-w-[20ch]">
											Rejected {pluralize("Quotation", rejectedQuotes.length)}
										</span>
									</span>
								</span>
							</p>
						)}
						{pendingQuoteResponse.length > 0 && (
							<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
								<span className="inline-flex items-center gap-2.5">
									<Loader2 size={"16"} className="text-primary" />
									<span className="text-xs">
										<span className="font-bold">
											{pendingQuoteResponse.length}
										</span>{" "}
										<span className=" min-w-[20ch]">
											Pending{" "}
											{pluralize("Quotation", pendingQuoteResponse.length)}
										</span>
									</span>
								</span>
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="table-wrapper">
				<table className="table w-full text-sm">
					<thead>
						<tr>
							<th>
								<span className="text-xs">#</span>
							</th>
							<th>ID</th>
							<th>RFQ ID</th>
							<th>Deadline</th>
							<th>My Response</th>
							{/* <th>Submitted Date</th> */}
							<th>Evaluation Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody className="text-xs">
						{rfqResponses?.map((response, idx: number) => {
							return (
								<tr key={response.unique_id}>
									<td className="relative">
										<span className="text-xs">{idx + 1}</span>.
									</td>
									<td>{response.unique_id}</td>
									{/* <td>{quote.quotation.rfq.unique_id}</td> */}
									<td>{response.rfq.unique_id}</td>
									<td>
										<p className="">
											{formatDistance(new Date(response.deadline), new Date(), {
												addSuffix: true,
											})}
										</p>
									</td>

									<th>
										{response.status.toLowerCase() === "accepted" ? (
											<Badge variant={"success"}>
												<CheckCircle2 className="" width={14} height={14} />
												<span>Submitted</span>
											</Badge>
										) : response.status.toLowerCase() === "pending" ? (
											<Badge variant={"outline"}>
												<Loader2 width={14} height={14} />
												Pending
											</Badge>
										) : (
											<Badge variant={"destructive"}>
												<XCircle width={14} height={14} />
												Declined
											</Badge>
										)}
									</th>

									{/* <td>{format(new Date(response.created_date), "PPP")}</td> */}

									<th>
										{response.approved_status === "ACCEPTED" ? (
											<Badge variant={"success"}>
												<CheckCircle2 width={16} height={16} />
												<span>Accepted</span>
											</Badge>
										) : response.approved_status === "PROCESSING" ? (
											<Badge variant={"outline"}>Processing</Badge>
										) : (
											<Badge variant={"destructive"}>
												<XCircle width={16} height={16} />
												<span>Rejected</span>
											</Badge>
										)}
									</th>

									<td className="w-[16ch]">
										<div className="inline-flex w-full items-center gap-1.5 text-sm">
											<BrowseRFQResponse
												autoFocus={false}
												data={response}
												hideStatus={true}
												user={user}
											/>

											{response.approved_status === "ACCEPTED" && (
												<Button size={"sm"} className="font-semibold">
													+ Invoice
												</Button>
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
