import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import CreateInvoice from "../Components/CreateInvoice";

export default async function page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		redirect("/account/login?next=/vendors/invoices");
	}

	if (!user.meta.vendor) {
		redirect("/dashboard");
	}
	const quote_id = props.searchParams.quotation;
	if (!quote_id) {
		return <Page404 />;
	}

	const response = await actionRequest<RFQResponse>({
		method: "get",
		url: "/procurement/quotations/respond/retrieve/" + quote_id,
	});

	if (!response.success) {
		return <Page404 error={response} />;
	}

	const rfqRespond = response.data;

	return (
		<section className="p-6">
			<div className="block bg-card mx-auto border rounded-md shadow max-w-[700px] p-6">
				<div className="grid">
					<h2 className="font-bold text-xl">Create Invoice</h2>
					<p className="max-w-[60ch] text-muted-foreground">
						Create an invoice for your quotation <b>{rfqRespond.unique_id}</b>{" "}
						here. Please provide the necessary details and click on{" "}
						{"'Submit Invoice'"} to submit the order.
					</p>
				</div>

				<CreateInvoice
					user={user}
					quote_id={quote_id}
					totalSum={Number(rfqRespond.pricing)}
				/>
			</div>
		</section>
	);
}
