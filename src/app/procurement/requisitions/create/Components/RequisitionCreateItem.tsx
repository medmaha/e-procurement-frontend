import { X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";

type Props = {
	idx: number;
	data?: RequisitionItem;
	remove: (idx: number) => void;
};

export default function RequisitionCreateItem({ idx, data, remove }: Props) {
	const qtyRef = useRef<HTMLInputElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const totalPrice = useRef<HTMLInputElement>(null);
	const totalPriceHidden = useRef<HTMLInputElement>(null);

	function updateTotalCost() {
		if (
			qtyRef.current &&
			priceRef.current &&
			totalPrice.current &&
			totalPriceHidden.current
		) {
			const qty = parseFloat(qtyRef.current.value);
			const price = parseFloat(priceRef.current.value);
			if (!isNaN(qty) && !isNaN(price)) {
				const total = qty * price;
				totalPrice.current.value = formatNumberAsCurrency(total);

				if (totalPriceHidden.current) {
					totalPriceHidden.current.value = total.toString();
				}
			} else {
				totalPrice.current.value = "";
				totalPriceHidden.current.value = "";
			}
		}
	}

	return (
		<tr className="">
			<td className="">
				<small className="w-full inline-flex justify-center items-center px-1">
					{idx + 1}.
				</small>
			</td>
			<td className="">
				{data && <input hidden defaultValue={data.id} name={`${idx + 1}-id`} />}
				<Input
					name={`${idx + 1}-description`}
					required
					defaultValue={data?.description}
					type="text"
					className="bg-transparent rounded h-full w-full p-1 border-none"
				/>
			</td>
			<td className="p-[4px] border">
				<MeasurementUnit idx={idx} defaultValue={data?.measurement_unit} />
			</td>
			<td style={{ padding: 0 }} className="">
				<Input
					ref={qtyRef}
					type="number"
					defaultValue={data?.quantity}
					required
					name={`${idx + 1}-quantity`}
					onInput={updateTotalCost}
					className="bg-transparent rounded h-full max-w-[6ch] p-1 border-none"
				/>
			</td>
			<td style={{ padding: 0 }} className="">
				<Input
					ref={priceRef}
					type="number"
					defaultValue={data && Number(data.unit_cost)}
					required
					name={`${idx + 1}-unit_cost`}
					onInput={updateTotalCost}
					className="bg-transparent rounded h-full w-full p-1 border-none"
				/>
			</td>
			<td style={{ padding: 0 }} className="">
				<input
					ref={totalPriceHidden}
					type="hidden"
					value={data?.total_cost || totalPriceHidden.current?.value || ""}
				/>
				<Input
					ref={totalPrice}
					readOnly
					placeholder="auto"
					disabled
					defaultValue={data && formatNumberAsCurrency(Number(data.total_cost))}
					className="bg-transparent placeholder:pl-4 placeholder:capitalize h-full w-full rounded p-1 border-none pointer-events-none"
				/>
			</td>
			<td style={{ padding: 0 }} className="">
				<Input
					defaultValue={data && Number(data.unit_cost)}
					name={`${idx + 1}-remark`}
					className="bg-transparent rounded h-full w-full p-1 border-none"
				/>
			</td>
			<td style={{ padding: 0 }} className="">
				<div className="inline-flex items-center justify-center h-full w-full">
					<Button
						title="Remove"
						type="button"
						className="w-6 mt-1.5 hover:bg-destructive hover:opacity-90 h-6 p-1 bg-destructive text-destructive-foreground rounded-full"
						onClick={() => remove(idx)}
					>
						<X />
					</Button>
				</div>
			</td>
		</tr>
	);
}

export function MeasurementUnit({ idx, defaultValue }: any) {
	return (
		<Select
			required
			name={`${idx + 1}-measurement_unit`}
			defaultValue={defaultValue}
		>
			<SelectTrigger className="min-w-[10ch] bg-transparent border-none h-full text-sm">
				<SelectValue placeholder="" />
			</SelectTrigger>
			<SelectContent className="">
				<SelectGroup className="">
					<SelectLabel className="px-4">Unit of Measurement</SelectLabel>
					<SelectItem className="px-4" value="units">
						Unit
					</SelectItem>
					<SelectItem className="px-4" value="pieces">
						Pieces
					</SelectItem>
					<SelectItem className="px-4" value="bytes">
						Bytes
					</SelectItem>
					<SelectItem className="px-4" value="bundles">
						Bundles
					</SelectItem>
					<SelectItem className="px-4" value="litres">
						Litres
					</SelectItem>
					<SelectItem className="px-4" value="metres">
						Metres
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function formatNumberAsCurrency(value: number, country = "The Gambia") {
	let v = "";
	if (country === "The Gambia") {
		v = value.toLocaleString("en-GM", {
			currency: "GMD",
			maximumFractionDigits: 2,
		});
	}

	return "D" + v;
}
