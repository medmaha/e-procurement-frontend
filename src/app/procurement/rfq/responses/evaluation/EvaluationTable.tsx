"use client";
import { useState, useMemo } from "react";
import RFQQuotationEvaluation from "./QuotationEvalutation";

type Props = {
	rfq: RFQ;
	item: RFQItem;
	user: AuthUser;
	index: number;
	updateReload: () => Promise<void>;
	quotations: RFQResponse[];
};

export default function EvaluationTable(props: Props) {
	const [loading, setLoading] = useState(true);
	const { index, item, user } = props;

	const sortedQuotations = useMemo(() => {
		return props.quotations;
	}, [props.quotations]);

	return (
		<div className={`mb-4 pt-6 w-full`} key={item.id}>
			<div className="flex gap-4 items-center pb-2.5 w-full ">
				<h2 className="text-lg font-semibold">
					{index + 1}. {item.item_description}{" "}
				</h2>
				<div className="inline-flex bg-muted text-muted-foreground p-2 rounded-full items-center gap-4 justify-between">
					<div className="inline-grid text-xs items-center gap-1 grid-cols-2">
						<span>QTY:</span>
						<span>{item.quantity}</span>
					</div>
					<div className="inline-flex text-xs items-center gap-1 ">
						<span>Evaluation Criteria:</span>
						<span>{item.eval_criteria || "N/A"}</span>
					</div>
				</div>
			</div>
			<div className="table-wrapper">
				<table className={`table w-full text-sm`}>
					<thead className="h-12 bg-accent px-1">
						<tr>
							<th>
								<small>#</small>
							</th>
							<th>Vendor</th>
							<th>Proforma</th>
							<th>Form-101</th>
							{/* <th className="">Qty</th> */}
							<th className="">Pricing (GMD)</th>
							<th className="">Compliance Status</th>
							{/* <th className="">Rating</th> */}
							<th className="">Status</th>
							<th>Remarks</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{sortedQuotations.map((quotation, j) => {
							return (
								<RFQQuotationEvaluation
									updateReload={props.updateReload}
									item={item}
									user={user}
									quotation={quotation}
									setLoading={setLoading}
									itemIndex={index}
									loading={loading}
									quotationIndex={j}
									key={quotation.id}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
