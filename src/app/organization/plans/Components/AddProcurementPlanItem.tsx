import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
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
import { Label } from "@radix-ui/react-label";
import { addErrorIdsToLocalStorage } from "./helpers";

import MeasurementUnitSelection from "@/Components/widget/MeasurementUnitSelect";

type Props = {
	idx: number;
	isLast?: boolean;
	remove: () => void;
};

export default function AddProcurementPlanItem({ idx, remove, isLast }: Props) {
	const { pending } = useFormStatus();
	const tid = useRef(0);
	const timeout = useRef<any>(0);
	const CACHE = useRef<Map<string, any>>(new Map());

	useEffect(() => {
		const cleanup = () => {
			CACHE.current?.clear();
			clearTimeout(timeout.current);
			toast.dismiss(tid.current ?? localStorage.getItem("toastId"));
		};

		cleanup();
		return cleanup;
	}, []);

	function handleInput({ target }: any) {
		let toastId = tid.current;
		clearTimeout(timeout.current);
		const name = target.name;
		const value = target.value ?? 0;

		if (isNaN(Number(value))) return;

		if (name) {
			if (!CACHE.current.has("___" + String(idx + 1))) {
				CACHE.current.set("___" + String(idx + 1), {});
			}
			const cache = CACHE.current.get("___" + String(idx + 1));
			cache[name.replace(/^\d+-/, "")] = Number(value);

			const budget = cache["budget"];

			if (budget) {
				if (!validateMoney(budget, cache)) {
					timeout.current = setTimeout(() => {
						toast.dismiss(toastId);
						tid.current = toast.error(
							`Field NO ${
								idx + 1
							}. Has invalid data on quarters which doesn't match the total budget`,
							{
								autoClose: false,
								position: "bottom-center",
								closeButton: false,
								className: "text-center",
							}
						) as number;
						localStorage.setItem("toastId", String(tid.current));
						addErrorIdsToLocalStorage(String(tid.current), "toastIds");
					}, 200);

					return;
				}
			} else {
				toast.dismiss(toastId);
			}
			toast.done(toastId);
		}
	}

	function validateMoney(budget: number, field: (typeof fields)[0]) {
		let totalQuarters = 0;
		for (const entry of Object.entries(field)) {
			if (entry[0].match(/quarter/)) {
				totalQuarters += Number(entry[1]);
			}
		}
		return Number(budget) >= Number(totalQuarters);
	}

	return (
		<div className="grid grid-cols-[10px,1fr,auto]">
			<p className="text-xs">
				<span className="inline-flex items-center justify-center h-full w-full">
					<small
						className={`${idx === 0 ? "mt-5" : ""}
						`}
					>
						{idx + 1}.
					</small>
				</span>
			</p>
			<div
				style={{ gridTemplateColumns: rowsClass }}
				className={`grid gap-1 px-1`}
			>
				{fields.map((field) => (
					<div
						className={`${field.type === "text" ? "col-span-2" : ""} pb-1`}
						key={field.name}
					>
						{idx === 0 && (
							<Label className="capitalize font-light text-sm">
								{field.label}{" "}
								{field.required && (
									<span
										title={`${field.label} field is required`}
										className="pt-2 text-primary font-bold"
									>
										*
									</span>
								)}
							</Label>
						)}{" "}
						{field.type !== "select" ? (
							<Input
								required={field.required}
								type={field.type}
								disabled={pending}
								name={`${idx + 1}-${field.name}`}
								autoFocus={isLast && field.type === "text"}
								placeholder={field.placeholder}
								className={`${
									field.type === "text" ? "min-w-[130px]" : ""
								} p-0 px-1 h-[30px] rounded-none disabled:pointer-events-none`}
								onChange={handleInput}
							/>
						) : (
							<>
								{field.selector && (
									<field.selector
										triggerClassName="h-[30px] rounded-none"
										name={`${idx + 1}-${field.name}`}
										disabled={pending}
										required={field.required}
									/>
								)}
							</>
						)}
					</div>
				))}
			</div>
			<div className="">
				<div className="inline-flex items-center justify-center h-full w-full">
					<Button
						title="Remove"
						type="button"
						disabled={pending}
						className={`${
							idx === 0 ? "mt-5" : ""
						} w-6 hover:bg-destructive hover:opacity-90 h-6 p-1 bg-destructive text-destructive-foreground rounded-full  disabled:pointer-events-none
						`}
						onClick={remove}
					>
						<X />
					</Button>
				</div>
			</div>
		</div>
	);
}

const fields = [
	{
		type: "text",
		name: "description",
		label: "Description",
		required: true,
	},
	{
		type: "number",
		name: "quantity",
		label: "Qty",
	},

	{
		type: "select",
		selector: MeasurementUnitSelection,
		name: "measurement_unit",
		placeholder: "$",
		label: "M-Unit",
		required: true,
	},

	{
		type: "number",
		name: "budget",
		placeholder: "$",
		label: "Budget",
		required: true,
	},
	{
		type: "number",
		name: "quarter_1_budget",
		placeholder: "$",
		label: "Quarter 1",
	},
	{
		type: "number",
		name: "quarter_2_budget",
		placeholder: "$",
		label: "Quarter 2",
	},
	{
		type: "number",
		name: "quarter_3_budget",
		placeholder: "$",
		label: "Quarter 3",
	},
	{
		type: "number",
		name: "quarter_4_budget",
		placeholder: "$",
		label: "Quarter 4",
	},
];

const rowsCount = fields.length + 1;
const rowsClass = `repeat(${rowsCount}, 1fr)`;
