"use client";
import { format } from "date-fns";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";
import OpenedBy from "@/Components/widget/OpenedBy";
import { Label } from "@radix-ui/react-label";

type Props = {
	user: AuthUser;
	rfq: RFQ;
};

type Props2 = {
	user: AuthUser;
	rfq: RFQ;
	children: ReactNode;
};

export function RFQDetailsModal({ user, rfq, children }: Props2) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="max-w-[95%] border-2 mx-auto overflow-hidden overflow-y-auto max-h-[95dvh] dark:bg-secondary dark:text-secondary-foreground">
					<DialogHeader>
						<DialogTitle className="sm:text-2xl">Create a RFQ</DialogTitle>
						<DialogDescription>
							Include a requisition-specific procurement rfq.
						</DialogDescription>
					</DialogHeader>
					<div className="bg-card rounded-md dark:py-2 dark:px-4">
						{isOpen && <RFQDetails user={user} rfq={rfq} />}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default function RFQDetails(props: Props) {
	const { rfq } = props;
	return (
		<div className="grid gap-2 w-full">
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 w-full">
				<div className="grid gap-1 col-span-1">
					<Label className="font-semibold">Requisition ID </Label>
					<p className="rounded-md border">
						<Link
							className="inline-block w-full hover:underline underline-offset-4 p-1 text-xs md:text-sm md:p-2 transition hover:bg-secondary hover:text-secondary-foreground"
							href={`/procurement/requisitions/${rfq?.requisition.unique_id}`}
						>
							{rfq?.requisition.unique_id}
						</Link>
					</p>
				</div>

				<div className="grid col-span-1 sm:col-span-2 gap-1 min-w-max">
					<Label className="font-semibold">Suppliers </Label>
					<div className="flex flex-wrap items-center gap-1 p-1 rounded-md border">
						{rfq?.suppliers.map((supplier) => {
							return (
								<Link
									href={"/suppliers/" + supplier.id}
									title={supplier.name}
									key={supplier.id}
									className="inline-block p-0.5 font-semibold text-xs md:p-1.5 text-secondary-foreground bg-secondary rounded-md truncate max-w-[15ch] md:max-w-[20ch]"
								>
									{supplier.name}
								</Link>
							);
						})}
					</div>
				</div>

				<div className="grid gap-1 col-span-1">
					<Label htmlFor="rfq" className="font-semibold">
						Officer{" "}
					</Label>

					<p className="rounded-md border">
						<Link
							className="inline-block w-full hover:underline underline-offset-4 p-1 text-xs md:text-sm md:p-2 transition hover:bg-secondary hover:text-secondary-foreground"
							href={`/organization/staffs/${rfq.officer.employee_id}`}
						>
							{rfq?.officer.name}
						</Link>
					</p>
				</div>
			</div>
			<div
				data-wrapper
				className="items max-h-[37dvh] h-full pr-4 overflow-auto"
			>
				<Label className="font-semibold pb-2">RFQ Items</Label>
				<div className="pt-4 table-wrapper">
					<table className="data-table w-full text-sm">
						<thead>
							<tr>
								<th>
									<small>#</small>
								</th>
								<th>Description</th>
								<th>Quantity</th>
								<th>Measurement Unit</th>
								<th>Evaluation Criteria</th>
								<th className="bg-secondary border-card">Unit Price</th>
								<th className="bg-secondary border-card">Total Price</th>
								<th className="bg-secondary border-card">Remarks</th>
							</tr>
						</thead>
						<tbody>
							{rfq.items.map((item, idx) => {
								return (
									<tr key={item.id}>
										<td>
											<small>{idx + 1}.</small>
										</td>
										<td>{item.item_description}</td>
										<td>{item.quantity}</td>
										<td>{item.measurement_unit}</td>
										<td>{item.eval_criteria}</td>
										<td className="bg-secondary border-card">-</td>
										<td className="bg-secondary border-card">-</td>
										<td className="bg-secondary border-card">-</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex items-center justify-between flex-wrap gap-4 md:gap-6">
				<div className="grid sm:grid-cols-[auto,auto] items-center w-max gap-4 pointer-events-none">
					<label className="text-sm font-semibold inline-block">
						Auto Publish:
					</label>
					<Switch
						onChange={() =>
							String(rfq?.auto_publish).toLowerCase() === "yes" ||
							!!rfq?.auto_publish === true
						}
						defaultChecked={
							String(rfq?.auto_publish).toLowerCase() === "yes" ||
							!!rfq?.auto_publish === true
						}
						id="auto_publish"
						name="auto_publish"
						className={`pointer-events-none"`}
					/>
				</div>
				<div className="grid sm:grid-cols-[auto,auto] items-center w-max gap-4">
					<label
						htmlFor="required_date"
						className="text-sm font-semibold inline-block"
					>
						Date Required:
					</label>
					<p className="p-2 rounded-md border text-muted-foreground">
						{rfq && format(new Date(rfq?.deadline), "PPP")}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 py-8">
				<div className="">
					<Label htmlFor="conditions" className="font-semibold pb-1.5">
						Terms And Conditions
					</Label>
					<p className="p-2 text-sm border rounded-md min-h-[70px] ">
						{rfq?.terms_and_conditions || "N/A"}
					</p>
				</div>
				<div className="">
					<Label htmlFor="description" className="font-semibold pb-1.5">
						Description
					</Label>
					<p className="p-2 min-h-[70px] text-sm border rounded-md">
						{rfq?.description || "N/A"}
					</p>
				</div>
			</div>

			<div className="grid gap-4 w-full pt-2">
				<OpenedBy isOpen rfq_id={rfq?.id} />
			</div>
		</div>
	);
}
