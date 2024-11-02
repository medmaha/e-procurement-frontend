import GoBack from "@/Components/ui/GoBack";
import { Button } from "@/Components/ui/button";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { generate_unique_id } from "@/lib/helpers/generator";
import {
	convertUrlSearchParamsToSearchString,
	formatNumberAsCurrency,
} from "@/lib/helpers/transformations";
import { actionRequest } from "@/lib/utils/actionRequest";
import { format } from "date-fns";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import NegotiationNodeDetails from "../Components/NegotiationNodeDetails";
import { Badge } from "@/Components/ui/badge";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	const queryString = convertUrlSearchParamsToSearchString(props.searchParams);
	if (!user) {
		return redirect("/account/login?next=/vendors/contracts" + queryString);
	}

	const contract_id = props.params.slug;

	const response = await actionRequest<RFQContractNegotiation>({
		method: "get",
		url: `/procurement/rfq/contracts/negotiations/${contract_id}/${queryString}`,
	});

	if (!response.success) return <Page404 error={response} />;

	const negotiation = response.data;

	return (
		<section className="section">
			<div className="section-heading !mb-2">
				<div className="">
					<GoBack />
				</div>
				<div className="grid items-start justify-start">
					<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
						RFQ Contracts Award{" "}
						<Link
							href={`/suppliers/${negotiation.supplier.id}`}
							className="link underline-offset-[7px] hover:underline"
						>
							{negotiation.supplier.name}
						</Link>{" "}
					</h1>
				</div>
			</div>

			<div className="section-content flex justify-between gap-4 flex-wrap">
				<p className="inline-flex items-center p-2 gap-4">
					<span className="text-muted-foreground">Negotiation Status:</span>
					<span className="inline-flex items-center gap-1">
						{["SUCCESSFUL", "ACTIVE"].includes(negotiation.status) && (
							<Badge variant={"success"}>
								<CheckCircle2 className="w-3 h-3" />
								<span className="">{negotiation.status}</span>
							</Badge>
						)}
						{["PENDING", "PROCESSING"].includes(negotiation.status) && (
							<Badge variant={"outline"} className="">
								<Loader2 className="w-4 h-4" />
								{negotiation.status}
							</Badge>
						)}
						{["TERMINATED", "UNSUCCESSFUL"].includes(
							negotiation.status.toLowerCase()
						) && (
							<Badge variant={"destructive"}>
								<XCircle className="text-destructive" />
								<span className="text-destructive">{negotiation.status}</span>
							</Badge>
						)}
					</span>
				</p>
				<p className="inline-flex items-center p-2 gap-1">
					<span className="text-muted-foreground text-sm">Date Initiated:</span>
					<b className="text-muted-foreground text-xs font-semibold">
						{format(new Date(negotiation.created_date), "PPP")}
					</b>
				</p>
			</div>

			<div className="table-wrapper">
				{/* TODO : Use the TabularData Table */}
				<table className="table w-full text-sm">
					<thead className="	 py-2">
						<tr className="">
							<th>
								<small>#</small>
							</th>
							<th>RFQ</th>
							<th>Author</th>
							<th>Pricing (GMD)</th>
							<th>Status</th>
							<th>Date</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{negotiation.notes.map((note, index) => (
							<tr key={note.id}>
								<td>
									<small>{index + 1}.</small>
								</td>
								<th>
									<Link
										href={`/procurement/rfq/${negotiation.contract.name}`}
										className="underline-offset-4 hover:underline transition"
									>
										{negotiation.contract.name}
									</Link>
								</th>
								<td>
									{/* <Link href={""} className="underline-offset-4 hover:underline transition">
												
                                        {note.author.name}
											</Link> */}

									<>{note.author.name}</>
								</td>

								<td>D{formatNumberAsCurrency(note.pricing)}</td>

								<td>
									<div
										className=""
										title={
											note.accepted
												? ""
												: note.renegotiated
												? "Rejected because of renegotiation"
												: ""
										}
									>
										{note.accepted ? (
											<Badge variant={"success"}>Accepted</Badge>
										) : note.renegotiated ? (
											<Badge variant={"destructive"}>Declined</Badge>
										) : (
											<Badge variant={"outline"}>Pending</Badge>
										)}
									</div>
								</td>

								<td>{format(new Date(note.created_date), "PPP")}</td>
								<td>
									<div className="inline-flex items-center gap-2">
										<NegotiationNodeDetails
											data={note}
											actions={
												negotiation.status.toLowerCase() === "pending" &&
												note.author.id !== user.meta.id
											}
											contract={negotiation.contract}
										/>
										{!!(
											!note.accepted &&
											!note.renegotiated &&
											note.author.profile_type !== "Staff"
										) && (
											<Button size={"sm"} variant={"destructive"}>
												Reject
											</Button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex items-start justify-between gap-4 flex-wrap px-2 w-full pt-4">
				<div className="">
					<p className="text-sm text-muted-foreground">
						Total Count: <b className="pl-2">{negotiation.notes.length}</b>
					</p>
				</div>
				{negotiation.can_award && (
					<div className="text-center flex-1">
						<Button className="font-semibold text-lg mt-2">
							Award Contract
						</Button>
						<p className="pt-1">
							<small>Award the contract by clicking the button above.</small>
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
