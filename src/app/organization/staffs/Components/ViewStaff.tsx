"use client";
import { format } from "date-fns";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { retrieveStaff } from "../actions";
import Link from "next/link";

const CACHE = new Map();

export default function ViewStaff({ staff, autoOpen = false }: any) {
	const [isOpen, setIsOpen] = useState(autoOpen);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"link"}
					className="font-semibold transition text-primary text-sm h-max p-1 px-3"
				>
					View
				</Button>
			</DialogTrigger>
			<Content open={isOpen} staff={staff} />
		</Dialog>
	);
}

function Content({ staff, open }: any) {
	return (
		<DialogContent className="max-w-[1000px] max-h-[90dvh] overflow-hidden overflow-y-auto">
			<DialogHeader>
				<DialogTitle className="sm:text-2xl">{staff.name}</DialogTitle>
				<DialogDescription asChild>
					<p className="text-sm py-0 my-0">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro,
						doloribus?
					</p>
				</DialogDescription>
			</DialogHeader>
			<StaffDetails data={staff} />
		</DialogContent>
	);
}

export function StaffDetails({ data, ...props }: any) {
	const [staff, setStaff] = useState(data);
	const [loading, setLoading] = useState(false);

	const staffRef = useRef(data);
	useLayoutEffect(() => {
		async function fetchData() {
			if (!CACHE.has(staffRef.current.id)) {
				setLoading(true);
				const response = await retrieveStaff(String(staffRef.current.id));
				setLoading(false);
				if (response.success) {
					const data = { ...staffRef.current, ...response.data };
					CACHE.set(staffRef.current.id, data);
					setStaff(data);
					return;
				}
				toast.error(response.message, { hideProgressBar: true });
			}
			setStaff(CACHE.get(staffRef.current.id));
		}
		if (!props.noFetch) fetchData();
	}, [props]);

	return (
		<>
			{/* <pre>
				<code>{JSON.stringify(staff, null, 4)}</code>
			</pre> */}
			<div className="block w-full">
				<div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full pt-4">
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Employee ID</p>
						<p className=" text-muted-foreground pt-0.5 truncate">
							{staff.employee_id}
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Full Name</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							<Link
								href={`/organization/staffs/${staff.id}`}
								className="transition hover:underline underline-offset-4 truncate"
							>
								{staff.name}
							</Link>
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Unit</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							<Link
								href={`/organization/departments/${staff.unit.id}`}
								className="transition hover:underline underline-offset-4 truncate"
							>
								{staff.unit?.name}
							</Link>
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Department</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							<Link
								href={`/organization/departments/${
									(staff.department || staff.unit.department)?.id
								}`}
								className="transition hover:underline underline-offset-4 truncate"
							>
								{(staff.department || staff.unit.department)?.name}
							</Link>
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Email Address</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							{staff.email}
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Job Title</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							{staff.job_title}
						</p>
					</div>
					<div className="grid">
						<p className="text-sm font-semibold leading-none">Status</p>
						<p
							className={`text-xs pt-0.5 truncate ${
								staff.disabled
									? "text-destructive"
									: "text-green-500 tracking-wide"
							}`}
						>
							<b className="text-current">
								{staff.disabled ? "Inactive" : "Active"}
							</b>
						</p>
					</div>
					<div className="grid">
						<p className="text-xs font-semibold leading-none">Date Joined</p>
						<p className="text-xs text-muted-foreground pt-0.5 truncate">
							2023/01/01
						</p>
					</div>
				</div>
				<div className="grid w-full mt-6">
					<p className="text-sm font-semibold leading-none mb-2">Biography</p>
					<p
						className={`text-xs text-muted-foreground truncate border p-1.5 sm:p-2 rounded-md w-full min-h-[70px] max-h-[200px] overflow-hidden overflow-y-auto`}
					>
						{staff.biography?.trim() || "N/A"}
					</p>
				</div>

				{/* TODO: Add items */}
				<div className="pt-4 mt-4">
					<h4 className="font-semibold pb-1 border-b">
						Authentication and Authorization Groups
					</h4>
					<div className="table-wrapper-mini">
						<table className="data-table w-full text-xs">
							<thead className="">
								<tr className="">
									<th className="">
										<small>#</small>
									</th>
									<th className="">Group Name</th>
									<th className="">Description</th>
									<th className="w-[8ch]">Perms</th>
									<th className="">Author</th>
									<th className="">CreatedAt</th>
								</tr>
							</thead>
							<tbody>
								{staff?.groups &&
									staff.groups.map((group: any, idx: any) => {
										return (
											<tr key={group.id}>
												<td>
													<small>{idx + 1}.</small>
												</td>
												<td>{group.name}</td>
												<td>
													<p
														title={group.description}
														className="text-xs truncate max-w-[40ch]"
													>
														{group.description}
													</p>
												</td>
												<td>
													<p className="pl-2 w-full">{group.permissions}</p>
												</td>
												<td>{group.authored_by}</td>
												<td>
													{group.created_date &&
														format(new Date(group.created_date), "PPP")}
												</td>
											</tr>
										);
									})}
								{/* {(staff?.group?.length || 5) < 5 &&
									new Array(5 - staff.group.length)
										.fill(Math.random())
										.map((group, index) => {
											return (
												<tr key={group}>
													<td>
														<small>{index + 1}.</small>
													</td>
													<td>-</td>
													<td>-</td>
													<td>-</td>
													<td>-</td>
													<td>-</td>
												</tr>
											);
										})} */}
							</tbody>
						</table>
						{loading && (
							<div className="pt-8 pb-4 text-muted-foreground">
								<p className="text-sm text-center w-full text-muted-foreground animate-pulse font-semibold">
									Loading Staff Data ...
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
