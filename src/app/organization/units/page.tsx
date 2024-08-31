import { Check, Info } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddUnit from "./Components/AddUnit";
import DisableUnit from "./Components/DisableUnit";
import EnableUnit from "./Components/EnableUnit";
import ViewUnit from "./Components/UnitDetails";
import { Unit } from "./types";
import { generate_unique_id } from "@/lib/helpers/generator";

export const metadata: Metadata = {
	title: "Units | E-Procurement",
	description: "Organization unit/branches page",
	keywords: "staff, branches, organization, procurement, e-procurement",
};

export default async function Page() {
	const user = await getAuthenticatedUser();

	if (!user) {
		redirect("/account/login?next=/organization/units");
	}
	const response = await actionRequest({
		method: "get",
		url: "/organization/units/",
	});

	if (!response.success) return <Page404 error={response} />;
	const units: Array<Unit> = response.data;
	const permissions = response.auth_perms!;

	if (!units || !units.length) {
		return (
			<div className="p-20">
				<div className="p-8 w-max mx-auto flex flex-col gap-8 items-center bg-card text-card-foreground rounded-lg border">
					<h1 className="font-bold text-xl sm:text-2xl text-center">
						Your Organization Has No Unit
					</h1>
					{permissions.create && (
						<div className="flex items-center flex-1 justify-end">
							<AddUnit />
						</div>
					)}
				</div>
			</div>
		);
	}

	function unitByStatus(status: boolean) {
		return units?.filter((unit) => !unit.disabled == status) || [];
	}
	const activeUnits = unitByStatus(true);
	const inactiveUnits = unitByStatus(false);
	return (
		<section className="section">
			<div className="section-heading">
				<div
					className={
						permissions.create
							? "grid"
							: "flex items-center justify-between gap-4 flex-wrap"
					}
				>
					<h1 className="text-xl sm:text-3xl font-bold">Units</h1>
					<div className="grid">
						{activeUnits.length > 0 && (
							<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
								<span className="inline-flex items-center gap-4">
									<Check size={"16"} className="text-primary" />
									<span className="text-xs">
										<span className="font-bold">{activeUnits.length}</span>{" "}
										Active {pluralize("Unit", activeUnits.length)}
									</span>
								</span>
							</p>
						)}
						{inactiveUnits.length > 0 && (
							<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
								<span className="inline-flex items-center gap-4">
									<Info size={"16"} className="text-destructive" />
									<span className="text-xs">
										<span className="font-bold">{inactiveUnits.length}</span>{" "}
										Disabled {pluralize("Unit", inactiveUnits.length)}
									</span>
								</span>
							</p>
						)}
					</div>
				</div>
				{permissions.create && (
					<div className="grid">
						<AddUnit text={"+ Create Unit"} />
					</div>
				)}
			</div>
			<div className="w-full">
				<div className="table-wrapper">
					<table className="table w-full">
						<thead>
							<tr>
								<th>
									<small>#</small>
								</th>
								<th>ID</th>
								<th>Name</th>
								<th>Staffs</th>
								<th>Unit Head</th>
								<th>Departments</th>
								<th>Status</th>
								{!!(permissions.delete || permissions.create) && (
									<th className="w-[10ch]">Action</th>
								)}
							</tr>
						</thead>
						<tbody className="text-sm">
							{units.map((unit, index) => {
								return (
									<tr key={unit.id}>
										<td>
											<small>{index + 1}</small>
										</td>
										<td>
											<Link
												href={`/organization/units/${unit.id}`}
												className="link transition underline-offset-4 hover:underline"
											>
												{generate_unique_id("", unit.id)}
											</Link>
										</td>
										<td>
											<Link
												href={`/organization/units/${unit.id}`}
												className="transition underline-offset-4 hover:underline"
											>
												{unit.name}
											</Link>
										</td>
										<th>
											<span className="pl-4">{unit.staffs.length}</span>
										</th>
										<th>
											{unit.unit_head ? (
												<Link
													href={`/organization/staffs/${unit.unit_head.id}`}
													className="transition underline-offset-4 hover:underline"
												>
													{unit.unit_head.name}
												</Link>
											) : (
												<span className="pl-6">-</span>
											)}
										</th>
										<td>
											<Link
												href={`/organization/departments/${unit.department.id}`}
												className="transition underline-offset-4 hover:underline"
											>
												{unit.department.name || "-"}
											</Link>
										</td>

										<td
											className={`font-semibold ${
												unit.disabled ? "text-destructive" : "text-green-500"
											}`}
										>
											{unit.disabled ? "Disable" : "Active"}
										</td>
										{!!(permissions.delete || permissions.create) && (
											<td>
												<span className="inline-flex items-center gap-1">
													{permissions.update && (
														<AddUnit unit={unit}>
															<Button
																size={"sm"}
																variant={"secondary"}
																className="font-semibold text-sm"
															>
																Update
															</Button>
														</AddUnit>
													)}
													{!unit.disabled && <DisableUnit unit={unit} />}
													{unit.disabled && <EnableUnit unit={unit} />}
												</span>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* <div className="mt-6 grid sm:grid-cols-2 sm:gap-6 gap-4">
				{units.map((unit) => (
					<div
						key={unit.id}
						className="sm:p-6 p-4 rounded-lg shadow-md border bg-card text-card-foreground"
					>
						<h3 className="font-semibold text-xl flex justify-between gap-4 flex-wrap">
							<span>{unit.name}</span>
							<ViewUnit unit={unit} />
						</h3>
						<p className="text-muted-foreground text-sm">
							{unit.description || "No description was provided for this unit"}
						</p>
						<div className="pt-6 flex items-center gap-6 flex-wrap justify-between">
							<div className="grid gap-2 w-full">
								<div className="grid grid-cols-2 w-full gap-2">
									<div className="grid-cols-1 pb-2">
										<p className="text-xs font-semibold leading-none">
											Unit Head
										</p>
										<p className="text-xs text-muted-foreground pt-1">
											{unit.unit_head ? (
												<Link href={"/"} className="hover:text-primary">
													@{unit.unit_head.name}
												</Link>
											) : (
												<span>N/A</span>
											)}
										</p>
									</div>
									<div className="grid-cols-1 pb-2">
										<p className="text-xs font-semibold leading-none">Staffs</p>
										<p className="text-xs flex gap-1 pt-1 truncate">
											{unit.staffs.slice(0, 3).map((staff, i) => {
												return (
													<Link
														href={"/"}
														key={staff.id}
														title={staff.name}
														className="text-muted-foreground hover:text-primary lowercase truncate"
													>
														@{staff.first_name + staff.last_name}
														{i !== unit.staffs.length - 1 && ","}
													</Link>
												);
											})}
											{!unit.staffs.length && (
												<span className="text-muted-foreground">N/A</span>
											)}
										</p>
									</div>
								</div>
								<div className="grid grid-cols-2">
									<div className="">
										<p className="text-xs font-semibold leading-none">
											Department
										</p>
										<p className="text-xs text-muted-foreground hover:text-primary pt-1">
											<Link href={"/"}>{unit.department?.name ?? "N/A"}</Link>
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex pt-4 items-center justify-end gap-4">
							{unit.disabled ? (
								<>
									<Button
										disabled
										className="h-max opacity-10 text-destructive-foreground bg-destructive pointer-events-none font-semibold p-1 px-2"
									>
										Disabled
									</Button>
									{permissions.delete && <EnableUnit unit={unit} />}
								</>
							) : (
								<>
									{permissions.delete ? (
										<>
											<AddUnit unit={unit}>
												<Button className="h-max font-semibold p-1 px-4">
													Edit
												</Button>
											</AddUnit>

											<DisableUnit unit={unit} />
										</>
									) : (
										<>
											<Button
												disabled
												variant={"ghost"}
												className="h-max opacity-10 pointer-events-none font-semibold p-1 px-2"
											>
												Enabled
											</Button>
										</>
									)}
								</>
							)}
						</div>
					</div>
				))}
			</div> */}
		</section>
	);
}

function pluralize(text: string, item_count: number) {
	return text + (item_count > 1 ? "s" : "");
}
