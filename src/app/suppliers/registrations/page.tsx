import { format } from "date-fns";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import ActivationButton from "../Components/ActivationButton";
import Link from "next/link";
import { generate_unique_id } from "@/lib/helpers/generator";

export const metadata: Metadata = {
	title: "Suppliers Registration | E-Procurement",
	description: "Vendor registration page",
	keywords:
		"vendors, registration, annual, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/suppliers/registrations");
	}

	const response = await actionRequest<VendorRegistration[]>({
		method: "get",
		url: "/vendors/registration/",
	});

	if (!response.success) {
		return <Page404 error={response} />;
	}

	const permissions = response.auth_perms;
	const registrations = response.data;

	const isVerified = (vendor: VendorRegistration) => {
		return vendor.is_email_verified === true;
	};

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
						Suppliers Registration
					</h2>
					<p className="text-muted-foreground max-w-[65ch]">
						Manage vendors that are trying to register with on your portal
					</p>
				</div>
			</div>
			<div className="table-wrapper">
				<table className="table w-full">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>ID</th>
							<th>Vendor</th>
							<th className="w-[15ch]">Status</th>
							<th className="w-[15ch]">Verified</th>
							<th>Date Joined</th>
							{permissions.update && (
								<th className="w-[15ch] text-center">Action</th>
							)}
						</tr>
					</thead>
					<tbody>
						{registrations.map((register, idx) => {
							return (
								<tr key={register.id}>
									<td>
										<small>{idx + 1}.</small>
									</td>
									<td>
										<Link
											href={`/suppliers/registrations/${register.id}`}
											className="truncate transition link hover:underline underline-offset-4"
										>
											{generate_unique_id("R", register.id)}
										</Link>
									</td>
									<td>
										<Link
											href={`/suppliers/${register.vendor.id}`}
											className="truncate transition hover:underline underline-offset-4"
										>
											{register.vendor.name}
										</Link>
									</td>
									<td
										className={`capitalize tracking-wide ${
											register.status == "inactive"
												? "text-destructive"
												: "text-green-500"
										}`}
									>
										{register.status}
									</td>
									<td>
										<p
											className={`pl-3.5 ${
												register.is_validated
													? "text-green-500"
													: "text-destructive"
											}`}
										>
											{register.is_validated ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											)}
										</p>
									</td>
									<td className="text-sm text-muted-foreground max-w-[15ch] truncate">
										{format(new Date(register.created_date), "PPPp")}
									</td>
									{permissions.update && (
										<td>
											{isVerified(register) ? (
												<ActivationButton
													obj_id={register.id}
													status={register.status}
												/>
											) : (
												<span className="text-muted-foreground text-sm font-semibold pl-2">
													N/A
												</span>
											)}
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{registrations.length < 1 && (
				<p className="pt-6 text-sm text-muted-foreground text-center">
					No Data Found!
				</p>
			)}
		</section>
	);
}
