"use client";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/Components/ui/dialog";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { generate_unique_id } from "@/lib/helpers/generator";
import { format } from "date-fns";
import React from "react";
import RenegotiateContract from "./RenegotiateContract";
import { acceptContract } from "../actions";
import { toast } from "react-toastify";
import SubmitButton from "@/Components/widget/SubmitButton";

type Props = {
	data: RFQNegotiationNote;
	contract: {
		id: ID;
		name: string;
	};
	actions: boolean;
};

export default function NegotiationNodeDetails(props: Props) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [loading, toggleLoading] = React.useState(false);

	let data = props.data;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={"sm"} className="font-semibold">
					Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[1100px]">
				{isOpen && (
					<>
						<DialogHeader className="border-b pb-4">
							<DialogTitle className="sm:text-xl">
								Negotiation Details
							</DialogTitle>
							<DialogDescription>
								Browse the details of this negotiation terms, and accept or
								renegotiate if necessary
							</DialogDescription>
						</DialogHeader>

						<div className="grid sm:grid-cols-2 md:grid-cols-[60%_40%]">
							<div className="">
								<div className="grid grid-cols-2 gap-4">
									<div className="grid">
										<p className="font-semibold">Negotiation ID</p>
										<p className="text-sm">
											{generate_unique_id("N", data.id)}
										</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Author</p>
										<p className="text-sm">{data.author.name}</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Created Date</p>
										<p className="text-sm">
											{format(new Date(data.created_date), "PPP")}
										</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Payment Method</p>
										<p className="text-sm">{data.payment_method}</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Pricing</p>
										<p className="text-sm">
											D{formatNumberAsCurrency(data.pricing)}
										</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Validity Period</p>
										<p className="text-sm">
											{format(new Date(data.validity_period), "PPPp")}
										</p>
									</div>
									<div className="grid">
										<p className="font-semibold">Attachments</p>
										<p className="text-sm">
											{data.file ? (
												<a
													className="underline link"
													href={data.file}
													target="_blank"
													rel="noopener noreferrer"
												>
													View
												</a>
											) : (
												<span className="text-muted-foreground">
													No Attachments
												</span>
											)}
										</p>
									</div>
								</div>
							</div>
							<div className="">
								<div className="grid gap-2">
									<p className="font-semibold">Terms and Conditions</p>
									<p className="border p-2 rounded max-h-[40dvh] overflow-y-auto text-sm leading-relaxed min-h-[150px]">
										{data.note}
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4 w-full justify-center pt-4 border-t">
							<Button
								variant={"secondary"}
								onClick={() => setIsOpen(loading === false)}
								type="button"
								disabled={loading}
								className="sm:text-lg font-semibold w-full"
							>
								Close
							</Button>

							{props.actions && !data.renegotiated && (
								<>
									<form
										className="w-full"
										action={async (formData) => {
											toggleLoading(true);
											const response = await acceptContract(
												formData,
												location.pathname
											);
											toggleLoading(false);
											if (response.success) {
												toast.success(response.message);
												setIsOpen(false);
												return;
											}
											toast.error(response.message);
										}}
									>
										<input hidden name="note_id" value={props.data.id} />
										<input
											hidden
											name="contract_id"
											value={props.contract.id}
										/>
										<input hidden name="accept" value={props.contract.id} />
										<SubmitButton
											text="Accept Terms"
											className="sm:text-lg font-semibold w-full"
										/>
									</form>

									<RenegotiateContract
										contract_id={props.contract.id}
										data={data}
										disabled={loading}
									/>
								</>
							)}
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}