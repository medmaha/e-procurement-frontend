import { format } from "date-fns";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
	department: Department;
};
export default function DepartmentDetails({ department }: Props) {
	return (
		<>
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full pt-4">
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Department ID</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{generate_unique_id("", department.id)}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Department Head</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{department.department_head?.name || "N/A"}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Email Address</p>
					<p className="text-xs pt-0.5 truncate text-muted-foreground">
						{department.email}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Phone Number</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{department.phone || "N/A"}
					</p>
				</div>
				<div className="grid">
					<p className="text-sm font-semibold leading-none">Created Date</p>
					<p className="text-xs text-muted-foreground pt-0.5 truncate">
						{department.created_date &&
							format(new Date(department.created_date), "PP")}
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
						{department.last_modified &&
							format(new Date(department.last_modified), "PPPp")}
					</p>
				</div>
			</div>

			{/* Units */}
			<div className="pt-4 mt-4">
				<h4 className="font-semibold pb-1 border-b">Units</h4>
				{department?.units.length > 1 ? (
					<div className="table-wrapper-mini">
						<table className="data-table w-full text-xs">
							<thead className="">
								<tr className="">
									<th className="">
										<small>#</small>
									</th>
									<th className="">Name</th>
									<th className="">Unit Head</th>
									<th className="">Active</th>
								</tr>
							</thead>
							<tbody>
								{department?.units &&
									(department.units.length
										? department.units
										: ([{}, {}] as Department["units"])
									)?.map((unit, idx: any) => {
										return (
											<tr key={unit.id || unit.name || idx}>
												<td>
													<small>{idx + 1}.</small>
												</td>
												<td>{unit.name}</td>
												<td>
													{department.department_head ? (
														<>{department.department_head?.id}</>
													) : (
														"N/A"
													)}
												</td>
												<td className="w-[10ch]">
													<p
														className={`text-xs truncate max-w-[40ch] pl-1.5 font-semibold ${
															department.disabled
																? "text-destructive"
																: "text-green-500"
														}`}
													>
														{department.disabled ? "Inactive" : "Active"}
													</p>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>
				) : (
					<p className="font-semibold underline underline-offset-8  text-muted-foreground p-4 pt-8 text-center">
						No Units Found!
					</p>
				)}
			</div>

			{/* Staffs */}
			<div className="pt-2">
				<h4 className="font-semibold pb-1 border-b">Staffs</h4>
				{(department?.staffs?.length || 0) > 0 ? (
					<div className="table-wrapper-mini">
						<table className="data-table w-full text-xs">
							<thead className="">
								<tr className="">
									<th className="">
										<small>#</small>
									</th>
									<th className="">Name</th>
									<th className="">Unit</th>
									<th className="">Position</th>
									<th className="">Active</th>
								</tr>
							</thead>
							<tbody>
								{(department.staffs?.length
									? department.staffs
									: ([{}, {}] as Department["staffs"])
								)?.map((staff, idx: any) => {
									return (
										<tr key={staff.id || staff.name || idx}>
											<td>
												<small>{idx + 1}.</small>
											</td>
											<td>{staff.name}</td>
											<td>{staff.unit.name}</td>
											<td>{staff.job_title}</td>
											<td className="w-[10ch]">
												<p
													className={`text-xs truncate max-w-[40ch] pl-1.5 font-semibold ${
														staff.disabled
															? "text-destructive"
															: "text-green-500"
													}`}
												>
													{staff.disabled ? "Inactive" : "Active"}
												</p>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<p className="font-semibold underline underline-offset-8  text-muted-foreground p-4 pt-8 text-center">
						No Staffs Found!
					</p>
				)}
			</div>
		</>
	);
}
