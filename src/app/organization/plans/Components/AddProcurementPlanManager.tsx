"use client";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { DialogFooter } from "@/Components/ui/dialog";
import {
	formatNumberAsCurrency,
	transformFormDataWithItems,
} from "@/lib/helpers";
import { generateHex } from "@/lib/utils/generators";
import { Label } from "@radix-ui/react-label";
import { createDepartmentProcurementPlan } from "../actions";
import AddProcurementPlanItem from "./AddProcurementPlanItem";
import DepartmentSelection from "@/Components/widget/DepartmentsSelect";

type Item = {
	id: string;
	isNew?: boolean;
};

type Props = {
	closeDialog: () => void;
};

export default function AddProcurementPlanManager({ closeDialog }: Props) {
	const [items, setItems] = useState<Item[]>([
		{
			id: generateHex(),
		},
		{
			id: generateHex(),
		},
	]);
	const [totalBudget, updateTotal] = useState(0);

	const toastId = useRef(0);

	function addItem() {
		setItems((prev) => {
			prev = prev.reduce((_items, current) => {
				current.isNew = false;
				_items.push(current);
				return _items;
			}, [] as Item[]);
			return [
				...prev,
				{
					id: generateHex(),
					isNew: true,
				},
			];
		});
	}

	function removeItem(id: string) {
		if (items.length == 1) {
			return;
		}
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	const { pending } = useFormStatus();

	async function submitForm(formData: FormData) {
		if (pending) return;
		if (formRef.current && !formRef.current.checkValidity()){
			formRef.current.reportValidity();
			return ;
		}

		const json = transformFormDataWithItems(formData);

		const errorToast = (message: string) => {
			toast.dismiss(localStorage.getItem("toastId") || "");
			const tid = toast.error(message, {
				autoClose: false,
				position: "bottom-center",
				closeButton: false,
				className: "text-center",
			}) as number;
			toastId.current = tid;
			localStorage.setItem("toastId", String(tid));
		};

		const { items } = json;

		let idx = 1;
		for (const item of items) {
			const budget = item["budget"];
			if (isNaN(budget) || budget === 0) {
				errorToast(`Field no ${idx}. Budget must not empty or (0) zero`);
				return;
			}
			let quarters = 0;
			inner: for (const field of Object.entries(item)) {
				if (quarters) break inner;
				if (field[0].match(/quarter/)) {
					if (field[1]) {
						quarters++;
					}
				}
			}
			if (!quarters) {
				errorToast(`Field No ${idx}. At least one quarter is required`);
				return;
			}
			if (!validateMoney(budget, item)) {
				errorToast(
					`Field NO ${idx}. Has invalid data on quarters which doesn't match the total budget`
				);
				return;
			}
		}

		const data = {
			...json,
		};

		const response = await createDepartmentProcurementPlan(
			data,
			location.pathname
		);

		if (!response.success) {
			toast.error(response.message);
			return;
		}

		toast.success(response.message);
		formRef.current?.reset();
		closeDialog();
	}

	const formRef = useRef<HTMLFormElement>(null);

	async function handleFormChange({ currentTarget }: any) {
		toast.dismiss(toastId.current);
		const formData = new FormData(currentTarget);

		return new Promise((resolve, reject) => {
			const json = transformFormDataWithItems(formData);
			updateTotal(() => {
				return json.items.reduce((value: any, item: any) => {
					value += Number(item.budget || 0);
					return value;
				}, 0);
			});
			resolve("");
		});
	}

	function validateMoney(budget: number, field: any) {
		let totalQuarters = 0;
		for (const entry of Object.entries(field)) {
			if (isNaN(Number(entry[1]))) continue;
			if (entry[0].match(/quarter/)) {
				totalQuarters += Number(entry[1]);
			}
		}
		return budget >= totalQuarters;
	}

	return (
		<form
			ref={formRef}
			onChange={handleFormChange}
			action={submitForm}
			className="grid gap-2 pt-4"
		>
			<div className="grid gap-1 pb-2">
				<Label htmlFor="department" className="font-semibold">
					Department{" "}
					<span
						title={`Department field is required`}
						className="pt-2 text-primary font-bold"
					>
						*
					</span>
				</Label>
				<DepartmentSelection name="department_id" />
			</div>
			<div className="items mt-4 max-h-[45dvh] h-full pr-4 overflow-auto">
				<Label className="font-semibold pb-2">Plan Items</Label>
				<div className="grid grid-cols-1">
					{items.map((item, idx) => (
						<div className="row" key={item.id}>
							<AddProcurementPlanItem
								idx={idx}
								isLast={item.isNew}
								remove={() => removeItem(item.id)}
							/>
						</div>
					))}
				</div>
			</div>

			<DialogFooter className="pt-6">
				<div className="flex items-center justify-between w-full gap-4">
					<Button
						type="button"
						title={"Add Plan Item"}
						className="w-8 h-8 p-1 self-start rounded-full bg-secondary hover:bg-secondary text-secondary-foreground border shadow"
						onClick={addItem}
					>
						<Plus />
					</Button>
					<p
						className={`${
							!totalBudget ? "opacity-0" : ""
						} transition inline-flex items-center gap-2`}
					>
						<span>Total Plan Budget:</span>
						<span>
							<b>D{formatNumberAsCurrency(totalBudget)}</b>
						</span>
					</p>
					<SubmitButton />
				</div>
			</DialogFooter>
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			type="submit"
			className="font-semibold text-lg disabled:pointer-events-none disabled:opacity-70"
		>
			{pending ? "Submitting..." : "Save Plan"}
		</Button>
	);
}
