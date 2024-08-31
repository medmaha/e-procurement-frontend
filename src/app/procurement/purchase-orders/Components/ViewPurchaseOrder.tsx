"use client";

import { format } from "date-fns";
import { cache, ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { retrievePurchaseOrder } from "../actions";
import ApprovePurchaseOrder from "./ApprovePurchaseOrder";
import RejectPurchaseOrder from "./RejectPurchaseOrder";

type Props = {
	data: PurchaseOrder;
	user: AuthUser;
	children: ReactNode;
};

const CACHE = new Map();

export default function ViewPurchaseOrder(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const [data, setData] = useState(props.data);

	const fetchData = useCallback(async () => {
		if (!isOpen) return;
		const order_id = props.data.id;
		const cache_id = "po_" + order_id;
		if (CACHE.has(cache_id)) return setData(CACHE.get(cache_id));
		const response = await retrievePurchaseOrder(order_id);
		if (response.success) {
			return setData((prev) => {
				const _cache = { ...(prev || {}), ...response.data };
				CACHE.set(cache_id, _cache);
				return _cache;
			});
		}
		toast.error(response.message);
	}, [props.data.id, isOpen]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			{isOpen && (
				<DialogContent className="max-w-[1300px] text-sm p-0">
					<DialogHeader className=" p-4 border-b">
						<DialogTitle>Order Information</DialogTitle>
						<DialogDescription>
							Every related information will be displayed here
						</DialogDescription>
					</DialogHeader>
					<div className="w-full overflow-hidden overflow-y-auto max-h-[75dvh] space-y-4 p-4 px-6">
						{/* PURCHASE ORDER */}
						<div className="grid">
							<h3 className="text-lg font-semibold pb-2">Purchase Order</h3>
							<table className="data-table bg-accent">
								<thead>
									<tr>
										<th>ID</th>
										<th>Officer</th>
										<th>Vendor</th>
										<th>Date</th>
										<th>Amount</th>
										<th>Comments</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{data.unique_id}</td>
										<td>{data.officer.name}</td>
										<td>{data.vendor.name}</td>
										<td>{format(new Date(data.last_modified), "PPPp")}</td>
										<td>
											D{formatNumberAsCurrency(data.rfq_response.pricing)}
										</td>
										<td>
											<p className="w-full truncate">{data.comments}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						{/* QUOTATION */}
						<div className="grid">
							<h3 className="text-lg font-semibold pb-2">Quotation Response</h3>
							<div className="grid">
								<table className="data-table bg-accent">
									<thead>
										<tr>
											<th>ID</th>
											<th>Vendor</th>
											<th>Invited At</th>
											<th>Submitted At</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{data.rfq_response.unique_id}</td>
											<td>{data.vendor.name}</td>
											<td>
												{data.rfq_response.invited_at &&
													format(
														new Date(data.rfq_response.invited_at),
														"PPPp"
													)}
											</td>
											<td>
												{data.rfq_response.invited_at &&
													format(
														new Date(data.rfq_response.created_date),
														"PPPp"
													)}
											</td>
										</tr>
									</tbody>
								</table>
								<h3 className="font-semibold pt-2">Quotation Items</h3>
								<table className="data-table bg-accent">
									<thead>
										<tr>
											<th>
												<small>#</small>
											</th>
											<th>Description</th>
											<th>QTY</th>
											<th>Measurement Unit</th>
											<th>Evaluation Criteria</th>
											<th>Unit Price</th>
											<th>Total Price</th>
											<th>Remarks</th>
										</tr>
									</thead>
									<tbody>
										{data.rfq_response.items?.map((item, idx) => {
											return (
												<tr key={item.id}>
													<td>
														<small>{idx + 1}.</small>
													</td>
													<td>{item.item_description}</td>
													<td>{item.quantity}</td>
													<td>{item.measurement_unit}</td>
													<td>{item.eval_criteria}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
						{/* RFQ */}
						<div className="grid">
							<h3 className="text-lg font-semibold pb-2">RFQ Details</h3>
							<table className="data-table bg-accent">
								<thead>
									<tr>
										<th>ID</th>
										<th>Requisition</th>
										<th>Title</th>
										<th>Description</th>
										<th>Date</th>
										<th>Deadline</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{data.rfq.unique_id}</td>
										<td>{data.rfq.requisition?.unique_id}</td>
										<td>{data.rfq.title}</td>
										<td>{data.rfq.description}</td>
										<td>
											{data.rfq.last_modified &&
												format(new Date(data.rfq.last_modified), "PPPp")}
										</td>
										<td>
											{data.rfq.last_modified &&
												format(new Date(data.rfq_response.deadline), "PPPp")}
										</td>
									</tr>
								</tbody>
							</table>
							<h3 className="font-semibold pt-2">RFQ Items</h3>
							<table className="data-table bg-accent">
								<thead>
									<tr>
										<th>
											<small>#</small>
										</th>
										<th>Description</th>
										<th>QTY</th>
										<th>Measurement Unit</th>
										<th>Evaluation Criteria</th>
									</tr>
								</thead>
								<tbody>
									{data.rfq_response.items?.map((item, idx) => {
										return (
											<tr key={item.id}>
												<td>
													<small>{idx + 1}.</small>
												</td>
												<td>{item.item_description}</td>
												<td>{item.quantity}</td>
												<td>{item.measurement_unit}</td>
												<td>{item.eval_criteria}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						{/* Action Buttons */}
						{!props.data.approvable && (
							<div className="grid grid-cols-2 gap-6">
								<DialogClose asChild>
									<Button variant={"outline"} className="font-semibold">
										Cancel
									</Button>
								</DialogClose>
								{data.rfq_response.deadline && data.status !== "PENDING" && (
									<Button className="font-semibold">
										View Approval Record
									</Button>
								)}
							</div>
						)}
						{props.data.approvable && (
							<div className="grid gap-4 sm:gap-6 sm:grid-cols-3 pt-2 py-6">
								<DialogClose asChild>
									<Button variant={"outline"} className="font-semibold">
										Cancel
									</Button>
								</DialogClose>
								<ApprovePurchaseOrder
									clearCache={() => CACHE.delete("po_" + props.data.id)}
									closeDialog={() => setOpen(false)}
									order_id={props.data.id}
									unique_id={props.data.unique_id}
								>
									<Button className="font-semibold">
										Approve Purchase Order
									</Button>
								</ApprovePurchaseOrder>
								<RejectPurchaseOrder
									clearCache={() => CACHE.delete("po_" + props.data.id)}
									closeDialog={() => setOpen(false)}
									order_id={props.data.id}
									unique_id={props.data.unique_id}
								>
									<Button variant={"destructive"} className="font-semibold">
										Reject Order
									</Button>
								</RejectPurchaseOrder>
							</div>
						)}
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
