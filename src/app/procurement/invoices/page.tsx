import { format } from "date-fns";
import { Check, Info } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { actionRequest } from "@/lib/utils/actionRequest";

export default async function Page() {
	const user = await getAuthenticatedUser();

	if (!user) {
		redirect("/account/login?next=/procurement/invoices");
	}

	const response = await actionRequest<Invoice[]>({
		method: "get",
		url: "/vendors/invoices/",
	});

	if (!response.success) {
		return (
			<pre>
				<code>{JSON.stringify(response, null, 4)}</code>
			</pre>
		);
	}

	const invoices = response.data;
	const permissions = response.auth_perms;

	function invoicesByStatus(status: Invoice["status"]) {
		return invoices.filter(
			(invoice) => invoice.status === status.toLowerCase()
		);
	}

	const pendingInvoices = invoicesByStatus("pending");
	const acceptedInvoices = invoicesByStatus("paid");

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					<h2 className="heading-text">Invoices</h2>
					{acceptedInvoices.length > 0 && (
						<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<span className="inline-flex items-center gap-4">
								<Check size={"16"} className="text-primary" />
								<span className="text-xs">
									<span className="font-bold">{acceptedInvoices.length}</span>{" "}
									Accepted {pluralize("Quotation", acceptedInvoices.length)}
								</span>
							</span>
						</p>
					)}
					{pendingInvoices.length > 0 && (
						<p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<span className="inline-flex items-center gap-4">
								<Info size={"16"} className="text-destructive" />
								<span className="text-xs">
									<span className="font-bold">{pendingInvoices.length}</span>{" "}
									<span className=" min-w-[20ch]">
										Pending {pluralize("Quotation", pendingInvoices.length)}
									</span>
								</span>
							</span>
						</p>
					)}
				</div>
			</div>

			<div className="table-wrapper">
				<table className="table w-full text-sm">
					<thead>
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>ID</th>
							<th>PO ID</th>
							<th>Vendor</th>
							<th>Invoice Date</th>
							<th>Amount</th>
							<th>Payment Terms</th>
							<th>Status</th>
							<th>Due Date</th>
							<th className="w-[10ch]">Actions</th>
						</tr>
					</thead>
					<tbody>
						{invoices.map((invoice, idx) => (
							<tr key={invoice.id}>
								<td>
									<small>{idx + 1}.</small>
								</td>
								<td>{invoice.id}</td>
								<td>{invoice.purchase_order.id}</td>
								<td>{invoice.vendor.name}</td>
								<td>{format(new Date(invoice.created_date), "PP")}</td>
								<td>D{formatNumberAsCurrency(invoice.amount)}</td>
								<td className="uppercase">{invoice.payment_terms}</td>
								<td className="uppercase">{invoice.status}</td>
								<td className="uppercase">
									{format(new Date(invoice.due_date), "PP")}
								</td>
								<td>
									<div className="inline-flex items-center w-full justify-between">
										<Button variant={"outline"} className="h-max p-1 px-1.5">
											View
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{invoices.length < 1 && (
				<p className="text-muted-foreground text-lg font-semibold text-center pt-16 pb-16 border-b">
					<Info size={"18"} className="text-muted-foreground mx-auto" />
					No Invoices Found
				</p>
			)}
		</section>
	);
}

function pluralize(text: string, item_count: number) {
	return text + (item_count > 1 ? "s" : "");
}
