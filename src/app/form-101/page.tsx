import { redirect } from "next/navigation";
import React from "react";
import Form101Template from "@/Components/pdf/form101/Template";
import RequisitionTemplate from "@/Components/pdf/requisition/Template";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import Page404 from "../not-found";
import { getForm101 } from "./actions";
import { returnTo } from "@/lib/server/urls";
import CloseWindow from "./Components/CloseWindow";
import GoBack from "@/Components/ui/GoBack";
import { revert_unique_id } from "@/lib/helpers/generator";

//

const file_types = ["rfq-request", "rfq", "requisition"];

type Form101FileType = "rfq-request" | "rfq" | "requisition";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();
	const searchParams = props.searchParams;

	if (!user) {
		return returnTo("/account/login", "/form-101", props.searchParams);
	}
	const model: Form101FileType = searchParams.m;
	const model_id = revert_unique_id(searchParams.i || "0");

	if (!model || !model_id || model_id === "0") {
		return (
			<Page404
				error={{ message: "We Couldn't found the Form you are looking for." }}
			/>
		);
	}

	if (!file_types.includes(model)) {
		return (
			<Page404 error={{ message: `Query param m="${model}" is invalid.` }} />
		);
	}

	if (isNaN(Number(model_id))) {
		return (
			<Page404 error={{ message: `Query param i="${model_id}" is invalid.` }} />
		);
	}

	const response = await getForm101({
		model,
		model_id: String(model_id),
	});

	if (!response.success) {
		return (
			<Page404
				error={{
					...response,
					message: response.message ?? "Unable to retrieve the Form 101",
				}}
			/>
		);
	}

	const quotation: Data = response.data;

	return (
		<section className="section">
			<div className="section-heading">
				<div className="">
					{props.searchParams.close ? <CloseWindow /> : <GoBack />}
				</div>
				<div className="grid h-full items-center">
					<h1 className="heading-text">
						{model === "requisition"
							? "GPPA Form 100 - Procurement Requisition"
							: "GPPA Form 101 Request For Quotation"}
					</h1>
				</div>
			</div>
			{/* <pre>
				<code>{JSON.stringify(quotation, null, 4)}</code>
			</pre> */}

			<section className="border-black/20 rounded-2xl overflow-hidden">
				{model === "requisition" ? (
					<RequisitionTemplate data={response.data} />
				) : file_types.includes(model) ? (
					<Form101Template
						header={{
							isRFQ: model == "rfq",
							title: quotation.title,
							to: quotation.vendor.name,
							toLocation: quotation.vendor.location,
							authorizedBy: quotation.authorizedBy,
							gppaNumber: String(quotation.gppaNumber),
							date: quotation.created_date,
							from: quotation.from,
							fromLocation: quotation.fromLocation,
							office_expenses: quotation.expense_office,
							quotation_no: quotation.unique_id,
							deadline: quotation.deadline,
							rfq_id: quotation.rfq_id,
						}}
						items={{
							data: quotation.items,
						}}
						openedBy={{
							suppliers: quotation.suppliers,
							data: quotation.openedBY,
						}}
					/>
				) : (
					"Do Something With This"
				)}
			</section>
		</section>
	);
}

interface Item {
	id: number;
	item_description: string;
	quantity: number;
	measurement_unit: string;
	eval_criteria: string;
	unit_price: number | null;
	total_price: number | null;
	remarks: string;
}

interface Vendor {
	id: number;
	name: string;
	location: string;
}

interface Data {
	id: number;
	items: Item[];
	title: string;
	created_date: string;
	last_modified: string;
	unique_id: string;
	vendor: Vendor;
	deadline: string;
	from: string;
	fromLocation: string;
	authorizedBy: string;
	rfq_id: string;
	suppliers?: {
		id: ID;
		name: string;
		location: string;
	}[];
	contact_person?: {
		id: ID;
		unique_id: string;
		name: string;
	};
	gppaNumber: number;
	openedBY: any[]; // Update this to the appropriate type if needed
	expense_office: string;
}
