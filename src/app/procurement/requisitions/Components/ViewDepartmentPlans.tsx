"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import CACHE from "@/lib/caching";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { getRequisitionDepartmentProcurementPlans } from "../actions";

export default function ViewDepartmentPlans({ requisition_id, children }: any) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children ? (
					children
				) : (
					<Button className="w-[100px] h-max p-1.5">View Plans</Button>
				)}
			</DialogTrigger>
			{isOpen && (
				<DialogContent className="max-w-[1000px] md:max-w-[90%] w-full shadow-2xl">
					<PlanContentTable requisition_id={requisition_id} />
				</DialogContent>
			)}
		</Dialog>
	);
}

function PlanContentTable({ requisition_id, department }: any) {
	const [data, setData] = useState<DepartmentProcurementPlan | null>(null);
	const toastId = useRef<ID | undefined>(undefined);

	const fetchData = useCallback(async () => {
		if (!CACHE.has(requisition_id + "_plans")) {
			const response = await getRequisitionDepartmentProcurementPlans(
				requisition_id
			);
			if (response.success) {
				// @ts-ignore
				const data = { department, ...response.data };
				CACHE.set(requisition_id, data);
				setData(data);
				return;
			}
			if (toastId.current) return;
			toastId.current = toast.error(response.message || "An error occurred", {
				hideProgressBar: true,
			});
			return;
		}
		if (CACHE.has(requisition_id + "_plans"))
			setData(CACHE.get(requisition_id + "_plans"));
	}, [requisition_id, department]);

	const getTotalBudget = () => {
		let total = 0;
		data?.items?.map((item) => {
			total += Number(item.budget);
		});
		return total;
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{data
						? data.department?.name + " | Annual Department Procurement Plans"
						: "Loading Department"}
				</DialogTitle>
				{data?.department?.description && (
					<DialogDescription>
						{data && (
							<>
								{data.department?.description}
								{data.department?.description && (
									<>
										<br />
										<br />
									</>
								)}
								<b>Description:</b> {data.description}
							</>
						)}
					</DialogDescription>
				)}
			</DialogHeader>
			<div className="w-full block">
				<table className="w-full data-table">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th className="text-sm">Item Description</th>
							<th className="text-sm">Quantity</th>
							<th className="text-sm">Budget</th>
							<th className="text-">M-Unit</th>
							<th className="text-sm capitalize">Method</th>
							<th className="text-sm">Quarter 1 Budget</th>
							<th className="text-sm">Quarter 2 Budget</th>
							<th className="text-sm">Quarter 3 Budget</th>
							<th className="text-sm">Quarter 4 Budget</th>
						</tr>
					</thead>
					<tbody>
						{data?.items?.map((item, index) => (
							<tr key={index}>
								<td>
									<small>{index + 1}.</small>
								</td>
								<td>{item.description}</td>
								<td>{item.quantity}</td>
								<td>D{formatNumberAsCurrency(item.budget)}</td>
								<td className="capitalize">{item.measurement_unit}</td>
								<td className="capitalize">{item.procurement_method}</td>
								<td>D{formatNumberAsCurrency(item.quarter_1_budget)}</td>
								<td>D{formatNumberAsCurrency(item.quarter_2_budget)}</td>
								<td>D{formatNumberAsCurrency(item.quarter_3_budget)}</td>
								<td>D{formatNumberAsCurrency(item.quarter_4_budget)}</td>
							</tr>
						))}
					</tbody>
				</table>
				{!!data && (
					<p className="text-right pt-4 text-muted-foreground">
						<b>Total Budget:</b> D{formatNumberAsCurrency(getTotalBudget())}
					</p>
				)}
				{!data && (
					<p className="text-center text-muted-foreground text-sm pb-2 pt-6">
						<>Loading Annual Plans ...</>
					</p>
				)}
				{!!data && data.items?.length < 1 && (
					<p className="text-center text-muted-foreground text-sm pb-2 pt-6">
						<>
							<b>
								{data.department?.name} Department, has no plans this summer
							</b>
						</>
					</p>
				)}
			</div>
		</>
	);
}
