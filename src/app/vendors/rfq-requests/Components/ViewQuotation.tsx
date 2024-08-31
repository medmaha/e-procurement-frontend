"use client";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";
import OpenedBy from "@/Components/widget/OpenedBy";
import Link from "next/link";

type Props = {
	user: AuthUser;
	data: RFQRequest;
	autoFocus: boolean;
};

export default function BrowseQuotation(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const router = useRouter();
	useLayoutEffect(() => {
		if (props.autoFocus) {
			setOpen(true);
		}
	}, [props.autoFocus]);
	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"secondary"}
					size={"sm"}
					className="font-semibold text-xs"
				>
					Browse
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[1200px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border-4 shadow-xl">
				<div className="flex justify-between gap-4 pr-8">
					<div className="text-sm">
						{/* <p>
								From: <b className="font-semibold">{APP_COMPANY.name}</b>
							</p> */}
						<p>
							To: <b className="text-lg pl-1">{props.user.meta.vendor?.name}</b>
						</p>
						<div className="pt-1 space-y-1">
							{/* <p className="text-sm text-muted-foreground">
								Authorized by:{" "}
								<b className="pl-2">{props.data.quotation.officer?.name}</b>
							</p> */}
							<p className="text-sm text-muted-foreground">
								Invited Date:{" "}
								<b className="pl-2">{format(props.data.created_date, "PP")}</b>
							</p>
							<p className="text-sm text-muted-foreground">
								Deadline Date:{" "}
								<b className="pl-2">{format(props.data.deadline, "PP")}</b>
							</p>
						</div>
					</div>
					<div className="text-center">
						<Link href={`/form-101?m=rfq-request&i=${props.data.id}`}>
							<Button size={"sm"} className="gap-2 text-base font-semibold">
								<Eye width={15} />
								<span>Form 101</span>
							</Button>
						</Link>
					</div>
					<div className="grid">
						<div className="text-sm">
							<p className="text-sm text-muted-foreground">
								RFQ No: <b className="pl-2">{props.data.unique_id}</b>
							</p>
							<p className="text-sm text-muted-foreground">
								Quotation No: <b className="pl-2">{props.data.unique_id}</b>
							</p>
						</div>
					</div>
				</div>

				{isOpen && (
					<div data-wrapper className="items h-full pr-4 overflow-auto">
						<p className="font-semibold pb-2">Quotation Items</p>
						<table className="data-table w-full">
							<thead>
								<tr className="text-xs">
									<th className="p-[16px]">
										<span className="text-xs">No.</span>
									</th>
									<th className="p-[16px]">Item Description</th>
									<th className="p-[16px]">Quantity</th>
									<th className="p-[16px] w-[18ch]">Measurement Unit</th>
									<th className="p-[16px] w-[20ch]">Evaluation Criteria</th>
									<th className="p-[16px] w-[100px] bg-secondary border-card">
										Unit Price
									</th>
									<th className="p-[16px] w-[100px] bg-secondary border-card">
										Total Price
									</th>
									<th className="p-[16px] bg-secondary border-card">Remark</th>
								</tr>
							</thead>
							<tbody className="text-sm">
								{props.data.items.map((quote, idx) => {
									return (
										<tr key={quote.item_description}>
											<td className=" border-l-0">
												<span className="text-xs">{idx + 1}.</span>
											</td>
											<td className="">
												<p
													title=""
													className="max-w-[30ch] line-clamp-1 capitalize"
												>
													{quote.item_description}
												</p>
											</td>
											<td className="capitalize ">{quote.quantity}</td>
											<td className="capitalize ">{quote.measurement_unit}</td>
											<td className="capitalize ">{quote.eval_criteria}</td>
											<td className="bg-secondary border-card"></td>
											<td className="bg-secondary border-card"></td>
											<td className="bg-secondary border-card"></td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<div className="mt-6">
							<OpenedBy rfq_id={props.data.id} />
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
