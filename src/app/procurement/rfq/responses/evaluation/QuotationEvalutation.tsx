"use client";
import { Badge } from "@/Components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import Quantity from "./fields/Quantity";
import Pricing from "./fields/Pricing";
import Specs from "./fields/Specs";
import Rating from "./fields/Rating";
import SubmitButton from "./fields/SubmitButton";
import RemoveButton from "./fields/RemoveButton";
import Comment from "./fields/Comment";
import { Button } from "@/Components/ui/button";

type Props = {
	updateReload: () => Promise<void>;
	item: RFQItem;
	user: AuthUser;
	loading: boolean;
	itemIndex: number;
	quotationIndex: number;
	quotation: RFQResponse;
	setLoading: (loading: boolean) => void;
};

function getEvaluation(quotation: RFQResponse, item: RFQItem) {
	const evaluation = quotation.evaluation?.find((e) => e.item_id === item.id);
	return evaluation;
}

type updater = <T extends keyof QuoteEvaluation>(
	key: T,
	value: QuoteEvaluation[T]
) => void;

export default function RFQQuotationEvaluation(props: Props) {
	const { user, item, quotation } = props;
	const [data, setData] = useState<QuoteEvaluation | undefined>(
		getEvaluation(props.quotation, props.item)
	);
	const submitted = useMemo(() => {
		return Boolean(
			props.quotation.evaluation?.find((e) => e.item_id === props.item.id)
		);
	}, [props.quotation, props.item.id]);

	useEffect(() => {
		setData(getEvaluation(props.quotation, props.item));
	}, [props.quotation, props.item]);

	const updateData: updater = (key, value) => {
		setData((prev) => {
			if (!prev) {
				const evaluation = {} as QuoteEvaluation;
				return {
					...evaluation,
					[key]: value,
				};
			}
			return {
				...prev,
				[key]: value,
			};
		});
	};

	function getDefaultValue<T extends keyof QuoteEvaluation>(key: T) {
		const _eval = quotation.evaluation?.find((e) => e.item_id === item.id)!;
		if (_eval) return _eval[key] as QuoteEvaluation[T];
		return undefined;
	}

	return (
		<tr key={quotation.id}>
			<td>
				<small>{props.quotationIndex + 1}.</small>
			</td>
			<td>
				<div className="font-semibold tracking-wide">
					{quotation.vendor.name}
				</div>
			</td>
			<td>
				<a href={props.quotation.proforma} target="_blank" rel="noreferrer">
					<Button size={"sm"} variant={"outline"}>
						Review
					</Button>
				</a>
			</td>
			<td>
				{props.quotation.form101 ? (
					<a href={props.quotation.form101} target="_blank">
						<Button size={"sm"} variant={"outline"}>
							View file
						</Button>
					</a>
				) : (
					<Badge variant={"outline"}>No File</Badge>
				)}
			</td>
			{/* <td>
				<Review data={quotation} user={user} />
			</td> */}
			{/* <td>
				<Quantity
					disabled={submitted}
					updateData={(value) => updateData("quantity", value)}
					defaultValue={getDefaultValue("quantity")}
				/>
			</td> */}
			<td>
				<Pricing
					disabled={submitted}
					updateData={(value) => updateData("pricing", value)}
					defaultValue={getDefaultValue("pricing")}
				/>
			</td>
			<td>
				<Specs
					disabled={submitted}
					updateData={(value) => updateData("specifications", value)}
					defaultValue={getDefaultValue("specifications")}
				/>
			</td>
			{/* <td>
				<Rating
					disabled={submitted}
					updateData={(rate: number) => updateData("rating", rate)}
					defaultValue={getDefaultValue("rating")}
				/>
			</td> */}
			<td>
				<Badge variant={"outline"} className="p-1 px-2">
					<span className="capitalize">
						{getDefaultValue("status") || "pending"}
					</span>
				</Badge>
			</td>
			<td>
				<div className="pl-2.5">
					<Comment
						disabled={submitted}
						updateData={(comment: string) => updateData("comments", comment)}
						defaultValue={getDefaultValue("comments")}
					/>
				</div>
			</td>

			<td className="">
				{!submitted && (
					<SubmitButton
						disabled={false}
						quotation={props.quotation}
						rfqItem={props.item}
						updateReload={props.updateReload}
						data={data}
					/>
				)}
				{submitted && (
					<div className="inline-flex flex-1 justify-end">
						<RemoveButton
							quotation={props.quotation}
							rfqItem={props.item}
							updateReload={props.updateReload}
							data={data}
						/>
					</div>
				)}
			</td>
		</tr>
	);
}
