"use client";
import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { retrieveRequisition } from "../actions";

type MainProps = {
	user: AuthUser;
	requisition: Requisition;
	children: ReactNode;
};

export default function ViewRequisitionDetails(props: MainProps) {
	const { user, children, requisition } = props;
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState(requisition);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			{isOpen && (
				<DialogContent className="max-w-[1200px] mx-auto p-0">
					<DialogHeader className="px-6 pt-4 border-b pb-2 flex justify-between w-full">
						<DialogTitle className="text-xl sm:text-2xl capitalize">
							{requisition.approval.stage} Requisition Approval
						</DialogTitle>
						<DialogDescription className="pb-0 mb-0">
							Please review the requisition details below and use the provided
							options to either approve or reject the requisition.
						</DialogDescription>
						<div className="w-full text-right flex items-center justify-end gap-4">
							<Link
								href={"/procurement/requisitions/" + requisition.id}
								className="p-1 px-2 h-max transition font-semibold underline-offset-4 hover:outline-muted-foreground outline-2 outline-transparent outline rounded-xl hover:underline text-sm text-muted-foreground hover:text-secondary-foreground bg-secondary "
							>
								More Details
							</Link>
							<Link
								href={"/form-101?m=requisition&i=" + requisition.id}
								className="p-1 px-2 h-max font-semibold text-sm opacity:70 bg-sky-500 rounded hover:bg-sky-600 transition text-black"
							>
								PDF File
							</Link>
						</div>
					</DialogHeader>
					<div className="max-h-[60dvh] min-h-[30dvh] px-6">
						<RequisitionDetails
							data={data}
							user={user}
							onRequisitionFetch={(d) => setData((p) => ({ ...p, ...d }))}
						/>
					</div>
					{/* <div className="flex items-center gap-2 justify-center h-full pb-8">
						<p className="text-xl">Approval:</p>
						<div className="text-xl inline-flex items-start gap-2 pl-4">
							{requisition.approval.status == "pending" ? (
								<Loader2
									className={`text-accent-foreground animate-spin duration-1000`}
								/>
							) : requisition.approval.status == "rejected" ? (
								<X className="text-destructive" />
							) : (
								<Check className="text-primary" />
							)}

							<p className="text-muted-foreground capitalize">
								{requisition.approval.status}
							</p>
						</div>
					</div> */}
					<div className="py-4 flex flex-wrap justify-between items-center gap-6 mt-2 px-6">
						<div className="grid gap-1">
							<p className="text-lg font-bold">Approval Status</p>
							<p className="capitalize opacity-60 inline-flex items-center gap-1">
								<span className="pt-0.5 inline-block">
									{requisition.approval.status.toLowerCase() == "pending" ? (
										<Loader2
											size={"16"}
											className={`text-accent-foreground animate-spin`}
										/>
									) : requisition.approval.status.toLowerCase() ==
									  "rejected" ? (
										<X size={"16"} className="text-destructive" />
									) : (
										<Check size={"16"} className="text-primary" />
									)}
								</span>
								<span className="opacity-60">
									{requisition.approval.status}
								</span>
							</p>
						</div>
						{requisition.approval.status.toLowerCase() === "pending" && (
							<div className="grid gap-1">
								<p className="text-lg font-bold">Approval Stage</p>
								<p className="capitalize opacity-60 inline-flex items-center gap-1">
									<span>
										{requisition.approval.stage}
										{["procurement", "finance"].includes(
											requisition.approval.stage.toLowerCase()
										)
											? " Department "
											: " "}
										Approval
									</span>
								</p>
							</div>
						)}
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}

const CACHE = new Map();

type Props = {
	user: AuthUser;
	data: Requisition;
	noFetch?: boolean;
	onRequisitionFetch?: (data: Requisition) => void;
};

export function RequisitionDetails({ user, data, ...props }: Props) {
	const [requisition, setRequisition] = useState(data);
	const requisitionRef = useRef(data);

	useLayoutEffect(() => {
		const tryFetch = props.onRequisitionFetch;
		async function fetchData() {
			if (!CACHE.has(requisitionRef.current.id)) {
				const response = await retrieveRequisition(
					String(requisitionRef.current.id)
				);
				if (response.success) {
					const data = await response.data;
					CACHE.set(requisitionRef.current.id, data);
					setRequisition(data);
					if (tryFetch) tryFetch(data);
					return;
				}
				toast.error(response.message, { hideProgressBar: true });
			}
			setRequisition(CACHE.get(requisitionRef.current.id));
		}
		if (tryFetch && !props.noFetch) fetchData();
	}, [props.onRequisitionFetch, props.noFetch]);

	return (
		<div className="block w-full">
			<div className="grid gap-4 sm:grid-cols-4 grid-cols-2 w-full pt-4">
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Requisition ID</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{requisition.unique_id}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Officer</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						<Link
							href={`/organization/staffs/${requisition.officer.id}`}
							className="transition hover:underline underline-offset-4 truncate"
						>
							{requisition.officer.name}
						</Link>
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Total Amount</p>
					<p
						title={requisition.officer.unit.name}
						className="text-xs  pt-0.5 truncate font-semibold"
					>
						D
						{formatNumberAsCurrency(
							requisition.items.reduce((acc, item) => {
								const total = acc + Number(item.total_cost);
								return total;
							}, 0)
						)}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Department</p>
					<p
						title={requisition.officer.department.name}
						className="text-xs text-muted-foreground pt-0.5 truncate"
					>
						<Link
							href={`/organization/staffs/${requisition.officer.department.id}`}
							className="transition hover:underline underline-offset-4 truncate"
						>
							{requisition.officer.department.name}
						</Link>
					</p>
				</div>
			</div>
			<div className="grid gap-4 sm:grid-cols-4 grid-cols-2 w-full pt-4">
				<div className="grid">
					<p className="text-xs font-semibold leading-none">
						Procurement Method
					</p>
					<p className="text-sm text-muted-foreground pt-0.5 uppercase">
						{requisition.approval.procurement_method}
					</p>
				</div>

				<div className="grid">
					<p className="text-sm font-semibold leading-none">Date Issued</p>
					<p
						title={requisition.created_date}
						className="text-xs text-muted-foreground pt-0.5 truncate"
					>
						{requisition.created_date &&
							format(new Date(requisition.created_date), "PPp")}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Last Modified</p>
					<p
						title={requisition.created_date}
						className="text-xs text-muted-foreground pt-0.5 truncate"
					>
						{requisition.created_date &&
							format(new Date(requisition.last_modified), "PPp")}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Request Type</p>
					<p
						title={requisition.request_type}
						className="text-xs text-muted-foreground pt-0.5 truncate"
					>
						{requisition.request_type || "N/A"}
					</p>
				</div>
			</div>
			{/* TODO: Add items */}
			<div className="pt-4">
				<h4 className="font-semibold pb-1 border-b">
					Requirements
					<small className="text-muted-foreground px-4">
						Total Items: {requisition.items?.length}
					</small>
				</h4>
				<table className="data-table w-full text-sm">
					<thead className="text-sm">
						<tr className="text-sm">
							<th className="text-sm">
								<small>#</small>
							</th>
							<th className="text-sm">Description</th>
							<th className="text-sm">Quantity</th>
							<th className="text-sm">Measurement Unit</th>
							<th className="text-sm">Unit Price</th>
							<th className="text-sm">Total Price</th>
							<th className="text-sm">Remark</th>
						</tr>
					</thead>
					<tbody>
						{requisition.items?.map((item, idx) => {
							return (
								<tr key={item.id}>
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>{item.description}</td>
									<td>{item.quantity}</td>
									<td className="capitalize">{item.measurement_unit}</td>
									<td>D{formatNumberAsCurrency(item.unit_cost)}</td>
									<td>
										D
										{formatNumberAsCurrency(
											Number(item.unit_cost) * Number(item.quantity)
										)}
									</td>
									<td>{(item as any).remark || "No remarks provided"}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
