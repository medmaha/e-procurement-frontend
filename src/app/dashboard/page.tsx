import { format } from "date-fns";
import { redirect } from "next/navigation";
import APP_COMPANY from "@/APP_COMPANY";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import ExpenseChart from "./Components/ExpenseChart";
import LoginsChart from "./Components/LoginsChart";
import ProcurementChart from "./Components/ProcurementChart";
import VendorsChart from "./Components/VendorsChart";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export const revalidate = 5;

export default async function page() {
	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/account/login");
	}
	if (user.meta.vendor?.id) redirect("/dashboard/vendor");

	return (
		<section className="p-3 sm:p-6">
			<ClientSitePage
				page={{
					title:"Dashboard"
				}}
			/>
			<div className="p-4 mb-8 bg-card shadow border rounded-md flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">
						{APP_COMPANY.name} - Procurement Portal
					</h2>
					<p className="text-muted-foreground text-xs max-w-[60ch] md:max-w-[80ch] line-clamp-2">
						{APP_COMPANY.description ??
							`No description provided for this organization`}
					</p>
				</div>
				<p className="text-sm text-muted-foreground">
					<b>Member Since:</b> {format(new Date(), "PPP")}
				</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6">
				<div className="col-span-2 md:col-span-1 grid md:grid-rows-[1fr,auto] p-4 shadow bg-card border rounded-md">
					<div className="block">
						<h3 className="font-bold pb-1">Annual Budget</h3>
						<p className="text-sm text-muted-foreground pb-2">
							The budget for the current annual plan.
						</p>
						<p className="mt-4 font-extrabold text-2xl md:text-3xl text-muted-foreground">
							D{formatNumberAsCurrency(15_000_000)}
						</p>
					</div>
					<p className="text-xs text-muted-foreground text-right h-max">
						<b>Active Since:</b>
						{" " + format(new Date(), "PPP")}
					</p>
				</div>
				<div className="grid col-span-2 p-4 shadow bg-card border rounded-md">
					<p className="text-muted-foreground text-center text-sm font-semibold">
						Monthly Outlays
					</p>
					<div className="min-h-[150px]">
						<ExpenseChart />
					</div>
				</div>

				<div className="grid col-span-2 sm:col-span-1 p-4 shadow bg-card border rounded-md">
					{/* <p className="text-muted-foreground text-center text-sm font-semibold">
						Procurements
					</p> */}
					<div className="min-h-[150px]">
						<ProcurementChart />
					</div>
				</div>
				<div className="grid p-4 col-span-2 sm:col-span-1 shadow bg-card border rounded-md">
					<p className="text-muted-foreground text-center text-sm font-semibold">
						Notable Supplier
					</p>
					<div className="min-h-[180px]">
						<VendorsChart />
					</div>
				</div>
				<div className="grid p-4 col-span-2 sm:col-span-1 shadow bg-card border rounded-md">
					<p className="text-muted-foreground text-center_ text-sm font-semibold">
						Active Users
					</p>
					<div className="min-h-[180px]">
						<LoginsChart />
					</div>
				</div>
				<div className="hidden sm:grid md:hidden p-4 shadow bg-card border rounded-md">
					<p className="text-muted-foreground text-center_ text-sm font-semibold">
						Active Users
					</p>
					<div className="min-h-[180px]">
						<LoginsChart />
					</div>
				</div>
			</div>
		</section>
	);
}
