"use client";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import React, { useLayoutEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import OpenedBy from "@/Components/widget/OpenedBy";
import { formatNumberAsCurrency } from "@/lib/helpers";
import APP_COMPANY from "@/APP_COMPANY";

type Props = {
	user: AuthUser;
	data: RFQResponse;
	hideStatus?: boolean;
	autoFocus?: boolean;
};

export default function BrowseRFQResponse(props: Props) {
	const [isOpen, setOpen] = useState(false);
	useLayoutEffect(() => {
		if (props.autoFocus) {
			setOpen(true);
		}
	}, [props.autoFocus]);

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild className="">
				<Button
					variant={"secondary"}
					size={"sm"}
					className="font-semibold text-xs"
				>
					Browse Quotation
				</Button>
			</DialogTrigger>
			<DialogContent
				className={`max-w-[1200px]
				w-full max-h-[98dvh] overflow-hidden overflow-y-auto border-4 shadow-xl`}
			>
				{isOpen && <RFQResponseContent {...props} />}
			</DialogContent>
		</Dialog>
	);
}

type Props2 = {
	user: AuthUser;
	data: RFQResponse;
	hideOPenedBy?: boolean;
	hideStatus?: boolean;
	autoFocus?: boolean;
};

export function RFQResponseContent(props: Props2) {
	return (
		<>
			{/* HEADING */}
			<div className="flex justify-between gap-4 pr-8">
				<div className="text-sm">
					{/* <p>
								From: <b className="font-semibold">{APP_COMPANY.name}</b>
							</p> */}
					<p>
						FROM: <b className="text-lg pl-1">{props.data.vendor.name}</b>
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
				{!props.hideStatus && (
					<div className="text-center">
						<p className="font-semibold w-full text-xl">
							{props.data.rfq.title}
						</p>
						{props.data.status === "ACCEPTED" && (
							<p className="text-green-500 text-center pt-4 text-sm border-green-500 tracking-wide font-semibold inline-flex items-center gap-2">
								<Check width={14} />
								<span>Responded</span>
							</p>
						)}
						{props.data.status === "REJECTED" && (
							<p className="text-destructive text-center pt-4 text-sm border-green-500 tracking-wide font-semibold inline-flex items-center gap-2">
								<X width={14} />
								<span>DECLINED</span>
							</p>
						)}
					</div>
				)}
				<div className="grid">
					<p>
						TO: <b className="text-lg pl-1">{APP_COMPANY.name}</b>
					</p>
					<div className="text-sm">
						<p className="text-sm text-muted-foreground">
							RFQ No: <b className="pl-2">{props.data.rfq.unique_id}</b>
						</p>
						<p className="text-sm text-muted-foreground">
							Respond Date:{" "}
							<b className="pl-2">{format(props.data.created_date, "PP")}</b>
						</p>
					</div>
				</div>
			</div>
			<div className="dark:bg-card space-y-4 dark:sm:p-4 dark:p-2">
				{/* Pricing, Payment, Delivery, Validity */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-[auto,1fr,1fr,1fr] gap-x-6 gap-4 pt-4 pb-2">
					{/* Total Price */}
					<div className="md:w-[100px] lg:w-[200px]">
						<div className="grid">
							<Label className="font-semibold text-lg">Total Price (GMD)</Label>
							<p className="text-lg font-semibold underline-offset-4 underline text-sky-500">
								D{formatNumberAsCurrency(props.data.pricing)}
							</p>
						</div>
					</div>
					{/* Validity Period */}
					<div className="grid gap-1">
						<Label className="font-semibold">Validity Period</Label>
						<p className="border p-2 rounded-md text-sm">
							{format(props.data.validity_period, "PPP")}
						</p>
					</div>
					{/* Delivery Terms */}
					<div className="grid gap-1">
						<Label className="font-semibold">Delivery Terms</Label>
						<p className="border p-2 rounded-md">{props.data.delivery_terms}</p>
					</div>
					{/* Payment Method */}
					<div className="grid gap-1">
						<Label className="font-semibold">Payment Method</Label>
						<p className="border p-2 rounded-md">{props.data.payment_method}</p>
					</div>
				</div>
				{/* FILES */}
				<div className="grid sm:grid-cols-2 gap-x-6 gap-4 pt-4">
					<div className="grid gap-1">
						<Label className="font-semibold pb-1" htmlFor="proforma">
							Proforma
						</Label>
						{props.data.proforma && (
							<a
								href={props.data.proforma}
								target="_blank"
								className="truncate capitalize inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
							>
								{props.data?.proforma?.split("/").at(-1)?.replace(".", " - ")}
							</a>
						)}
						{!props.data.proforma && (
							<a className="truncate inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground">
								No file included
							</a>
						)}
					</div>

					<div className="grid gap-1">
						<Label className="font-semibold pb-1">Form-101</Label>
						{props.data.form101 && !props.data.form101.match(/undefined/gi) && (
							<a
								href={props.data.form101}
								target="_blank"
								className="truncate capitalize inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
							>
								{props.data?.form101
									?.split("/")
									.at(-1)
									?.replace(/(\.|\.\w{0,})/gi, " - ")}
							</a>
						)}
						{!props.data.form101 ||
							(props.data.form101.match(/undefined/gi) && (
								<a className="truncate inline-block w-full p-2 outline-2 outline outline-secondary rounded-md text-muted-foreground">
									N/A
								</a>
							))}
					</div>
				</div>

				{/* Brochures */}
				{props.data.brochures?.length > 0 && (
					<div className="grid gap-1">
						<Label className="font-semibold pb-1">
							Brochures ({props.data.brochures.length})
						</Label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							{props.data.brochures.map((brochure, index) => {
								return (
									<a
										key={brochure.id}
										href={brochure.file}
										target="_blank"
										className="truncate capitalize inline-block w-full p-1.5 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
									>
										{`${index + 1}. ${brochure.name}`}
									</a>
								);
							})}
						</div>
					</div>
				)}

				{/* REMARKS */}
				<div className="grid gap-2 ">
					<Label className="font-semibold ">Comment / Remarks</Label>
					<p className="p-2 leading-relaxed tracking-wide border rounded-md text-sm min-h-[100px] max-h-[250px] overflow-hidden overflow-y-auto w-full">
						{props.data.remarks}
					</p>
				</div>
				{/* Opened By */}
				{checkOpenBy(props.hideOPenedBy) && (
					<div className="grid gap-2 ">
						<OpenedBy labelClass="text-sm" rfq_id={props.data.rfq.id} />
					</div>
				)}
			</div>
		</>
	);
}

function checkOpenBy(hideOPenedBy?: boolean) {
	if (!hideOPenedBy) return true;
	return false;
}
