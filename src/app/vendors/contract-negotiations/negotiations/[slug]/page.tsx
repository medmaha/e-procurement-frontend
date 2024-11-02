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

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	const queryString = convertUrlSearchParamsToSearchString(props.searchParams);
	if (!user) {
		return redirect("/account/login?next=/vendors/contracts" + queryString);
	}

	const contract_id = props.params.slug;

	const response = await actionRequest<RFQContractNegotiation>({
		method: "get",
		url: `/vendors/contracts/negotiations/${contract_id}/${queryString}`,
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
						RFQ Contracts{" "}
						<Link
							href={`/procurement/contracts/${negotiation.contract.id}`}
							className="text-muted-foreground hover:text-sky-500 underline-offset-[7px] hover:underline"
						>
							({generate_unique_id("", negotiation.contract.id)})
						</Link>{" "}
						Negotiation Records
					</h1>
				</div>
			</div>

			<div className="section-content min-h-[300px]">
				<div className="table-wrapper">
					{/* TODO : Use the TabularData Table */}
					<table className="table w-full text-sm">
						<thead className="bg-accent py-2">
							<tr className="h-[50px]">
								<th>
									<small>#</small>
								</th>
								<th>ID</th>
								<th>RFQ ID</th>
								<th>Author</th>
								<th>Pricing (GMD)</th>
								<th>Terms</th>
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
									<td>{generate_unique_id("", note.id)}</td>
									<th>
										<Link
											href={`/vendors/rfq-requests/?view=${negotiation.contract.name}`}
											className="underline-offset-4 hover:underline transition"
										>
											{negotiation.contract.name}
										</Link>
									</th>
									<td>
										{/* <Link href={""} className="underline-offset-4 hover:underline transition">
												
                                        {note.author.name}
											</Link> */}
										{note.author.profile_type === "Vendor" ? (
											user.meta?.vendor?.name
										) : (
											<>{note.author.name}</>
										)}
									</td>

									<td>D{formatNumberAsCurrency(note.pricing)}</td>
									<td>
										<p title={note.note} className="truncate max-w-[20ch]">
											{note.note?.slice(0, 25)}
										</p>
									</td>
									<td>
										<p
											className="pl-3.5"
											title={
												note.accepted
													? ""
													: note.renegotiated
													? "Rejected because of renegotiation"
													: ""
											}
										>
											{note.accepted ? (
												<CheckCircle2 className="text-green-500" />
											) : note.renegotiated ? (
												<XCircle className="text-destructive" />
											) : (
												<Loader2 className="animate-spin duration-1000 text-sky-600" />
											)}
										</p>
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
												note.author.profile_type !== "Vendor"
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
				<p className="text-sm text-muted-foreground pl-1">
					Total Count: <b className="pl-2">{negotiation.notes.length}</b>
				</p>
			</div>
		</section>
	);
}
