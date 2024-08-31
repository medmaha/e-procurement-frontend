import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import ApprovePurchaseOrder from "./Components/ApprovePurchaseOrder";
import InitializePurchaseOrderCreation from "./Components/InitializePurchaseOrderCreation";
import ViewPurchaseOrder from "./Components/ViewPurchaseOrder";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/account/login?next=/procurement/purchase-orders");
	}

	const response = await actionRequest<PurchaseOrder[]>({
		method: "get",
		url: "/procurement/purchase-orders/",
	});

	if (!response.success) {
		return (
			<pre>
				<code>{JSON.stringify(response, null, 4)}</code>
			</pre>
		);
	}

	const purchaseOrders = response.data;
	const permissions = response.auth_perms;

	async function cb() {
		"use server";
	}

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="heading-text">Purchase Orders</h2>
					<p className="text-muted-foreground text-sm lg:text-base">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
						dolores vel quaerat!
					</p>
				</div>
				{permissions.create && (
					<div className="">
						<InitializePurchaseOrderCreation>
							<Button className="text-lg font-semibold">
								Create Purchase Order
							</Button>
						</InitializePurchaseOrderCreation>
					</div>
				)}
			</div>

			<div className="table-wrapper">
				<table className="table w-full">
					<thead>
						<tr>
							<td className="w-[3ch]">
								<small>#</small>
							</td>
							<th>ID</th>
							<th>Vendor</th>
							<th>RFQ</th>
							<th>Quote</th>
							<th>Approval Status</th>
							<th>Created Date</th>
							<th className="w-[15ch]">
								<span className="inline-block text-center w-full">Action</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{purchaseOrders.map((order: any, idx: number) => {
							return (
								<tr key={order.id}>
									<td>
										{" "}
										<small>{idx + 1}.</small>{" "}
									</td>
									<td>{order.unique_id}</td>
									<td>{order.vendor.name}</td>
									<td>{order.rfq.unique_id}</td>
									<td>{order.quote.unique_id}</td>
									<td
										className={`${
											order.status === "PENDING"
												? "text-blue-500"
												: order.status === "ACCEPTED"
												? "text-green-500"
												: "text-destructive"
										}`}
									>
										{order.status}
									</td>
									<td>{format(new Date(order.last_modified), "PP")}</td>
									<td>
										<div className="inline-flex items-center w-full gap-1 justify-around">
											<ViewPurchaseOrder data={order} user={user}>
												<Button
													variant={"outline"}
													className="text-sm h-max p-1 px-2"
												>
													View
												</Button>
											</ViewPurchaseOrder>
											{order.approvable && (
												<ApprovePurchaseOrder
													order_id={order.id}
													unique_id={order.unique_id}
												>
													<Button className="text-sm h-max p-1 px-2">
														Approve
													</Button>
												</ApprovePurchaseOrder>
											)}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
