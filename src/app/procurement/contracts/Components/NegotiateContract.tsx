import React, { ReactNode } from "react";
import Link from "next/link";
import RFQContractNegotiationForm from "./NegotiationForm";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
	user: AuthUser;
	permissions: AuthPerm;
	children: ReactNode;
	quotation: RFQResponse;
	contract?: {
		id: string;
		status: string;
		officer: {
			id: ID;
			name: string;
		};
		approvable: boolean;
		terms_and_conditions: string;
	};
	submitNegotiation: (formData: FormData) => Promise<boolean>;
};

export default function NegotiateContract(props: Props) {
	const { user, quotation, permissions, submitNegotiation } = props;

	return (
		<section className="section">
			<div className="section-heading !mb-4">
				{props.children}
				<div className="">
					<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
						Contract Negotiation With{" "}
						<Link
							className="inline text-muted-foreground hover:underline transition underline-offset-[6px] hover:text-sky-500"
							href={"/suppliers/" + quotation.vendor.id}
						>
							<b>({quotation.vendor.name})</b>
						</Link>{" "}
					</h1>
				</div>
			</div>
			<div className="section-content">
				<h2 className="font-semibold text-xl">Negotiating Contract</h2>
				<p className="text-muted-foreground max-w-[70ch]">
					This negotiation will be based on the following RFQ{" "}
					<Link
						className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
						href={"/procurement/rfq/" + quotation.rfq.id}
					>
						<b>{generate_unique_id("RFQ", quotation.rfq.id)}</b>
					</Link>{" "}
					and Quotation{" "}
					<Link
						className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
						href={"/procurement/rfq/responses/" + quotation.unique_id}
					>
						<b>({quotation.unique_id})</b>{" "}
					</Link>{" "}
					which was submitted by{" "}
					<Link
						className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
						href={"/suppliers/" + quotation.vendor.id}
					>
						<b>{quotation.vendor.name}</b>
					</Link>
				</p>
			</div>
			<div className="section-content !p-0 overflow-hidden">
				<h2 className="font-semibold p-2 text-lg border-b text-center bg-accent text-accent-foreground">
					Negotiation Details
				</h2>

				<RFQContractNegotiationForm
					submitNegotiation={submitNegotiation}
					quotation_id={quotation.id}
					rfq_id={quotation.rfq.id}
					supplier_id={quotation.vendor.id}
					delivery_terms={quotation.delivery_terms}
					payment_method={quotation.payment_method}
					pricing={quotation.pricing}
					contract={props.contract}
					validity_period={quotation.validity_period}
				/>
			</div>
		</section>
	);
}
