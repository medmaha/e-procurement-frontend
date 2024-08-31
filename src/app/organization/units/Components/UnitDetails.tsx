"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
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
import { Unit } from "../types";
import Link from "next/link";

type Props = {
	unit: Unit;
};
export default function UnitDetails({ unit }: Props) {
	return (
		<>
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full pt-4">
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Unit ID</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{unit.unique_id}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Unit Head</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{unit.unit_head ? (
							<Link
								href={`/organization/staffs/${unit.unit_head.id}`}
								className="transition underline-offset-4 hover:underline"
							>
								{unit.unit_head?.name}
							</Link>
						) : (
							<span className="">N/A</span>
						)}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Department</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						<Link
							href={`/organization/departments/${unit.department.id}`}
							className="transition underline-offset-4 hover:underline"
						>
							{unit.department.name}
						</Link>
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Phone Number</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{unit.phone_number || "N/A"}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Created Date</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{unit.created_date && format(new Date(unit.created_date), "PP")}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Status</p>
					<p className="text-xs pt-0.5 truncate text-green-500 font-semibold tracking-wide">
						Active
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Active Since</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{unit.enabled_since && format(new Date(unit.enabled_since), "PPPp")}
					</p>
				</div>
			</div>
			<div className="pt-4 mt-4">
				<h4 className="font-semibold pb-1 border-b">Staffs</h4>
				<div className="table-wrapper-mini">
					<table className="data-table w-full text-xs">
						<thead className="">
							<tr className="">
								<th className="">
									<small>#</small>
								</th>
								<th className="">First Name</th>
								<th className="">Last Name</th>
								<th className="">Position</th>
							</tr>
						</thead>
						<tbody>
							{unit?.staffs &&
								(unit.staffs.length
									? unit.staffs
									: ([{}, {}] as Unit["staffs"])
								)?.map((staff, idx) => {
									return (
										<tr key={staff.id}>
											<td>
												<small>{idx + 1}.</small>
											</td>
											<td>{staff.first_name}</td>
											<td>{staff.last_name}</td>
											<td>{staff.job_title}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
