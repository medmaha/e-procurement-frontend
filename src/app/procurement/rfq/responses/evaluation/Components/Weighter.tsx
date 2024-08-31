"use client";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import React, { useContext, useRef, useState } from "react";
import { EvaluationContext } from "./Context";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function Weighter() {
	const { factors, addFactor, removeFactor, updateWeight, totalWeight } =
		useContext(EvaluationContext);

	const update = (factor: Factor, target: any) => {
		const input = target as HTMLInputElement;
		const weight = Number(target.value);

		if (isNaN(weight)) {
			input.value = "1";
			return;
		}

		if (weight >= 100) {
			input.value = "100";
			return;
		}

		if (weight <= 0) {
			input.value = "0";
			return;
		}
		updateWeight(factor.id, weight);
	};

	function addCriteria(c_name: string, c_value: string, successCB: any) {
		const _id = c_name.replace(/\s/, "").toLowerCase();
		const _id2 = c_name.replace(/\s/, "").toLowerCase();
		const _id3 = c_name.replace(/\s/, "").toLowerCase();

		const existing = factors.find((f) => f.id === _id);

		if (existing) {
			toast.warn("A factor with this name already exists");
			successCB(true);
			return;
		}

		const value = Number(c_value);

		if (isNaN(value)) {
			toast.warn("Weight must be an integer value ranged from 1 to 100");
			successCB(true);
			return;
		}

		const _factor: Factor = {
			label: c_name,
			id: _id,
			weight: Number(c_value),
		};

		addFactor(_factor);
		successCB(false);
	}

	return (
		<div className="shadow border p-4 rounded-md mb-6">
			<div className="pb-2 mb-4 flex justify-between border-b">
				<div className="">
					<h3 className="font-semibold text-lg ">
						Evaluation Factor Weighting
					</h3>
					<p className="text-sm text-muted-foreground">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores
						consectetur hic harum!
					</p>
				</div>
				{factors.length > 0 && (
					<div className="text-right">
						<p className="text-sm inline-flex items-center gap-2">
							<span>Total Weight:</span>
							<span
								className={`font-bold ${
									totalWeight !== 100 ? "text-destructive" : "text-sky-600"
								}`}
							>
								{totalWeight}%
							</span>
						</p>

						{totalWeight !== 100 && (
							<p className="text-xs text-destructive">
								The total weight must always sum up 100%
							</p>
						)}
					</div>
				)}
			</div>
			<div className="w-full flex justify-center flex-wrap lg:gap-6 gap-4 items-center">
				{factors.map((factor) => {
					return (
						<div key={factor.id} className="grid gap-1">
							<Label htmlFor={factor.id} className="capitalize">
								{factor.label}
							</Label>

							<div className="flex items-center gap-2">
								<div className="relative w-max">
									<Input
										onInput={(e: any) => update(factor, e.target)}
										type="number"
										className="w-[10ch]"
										min={1}
										max={100}
										maxLength={100}
										defaultValue={factor.weight}
									/>
									<span className="absolute top-1/2 translate-y-[-50%] right-9">
										%
									</span>
								</div>
								<div className="">
									<Button
										variant={"ghost"}
										className="text-destructive p-0 hover:bg-transparent h-max"
										onClick={() => removeFactor(factor.id)}
									>
										<X width={16} />
									</Button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="text-center mt-4 pt-2">
				<NewCriteria addCriteria={addCriteria} />
			</div>
		</div>
	);
}

type Props2 = {
	addCriteria: (
		name: string,
		value: string,
		cb: (arg: boolean) => void
	) => void;
};

function NewCriteria({ addCriteria }: Props2) {
	const nameRef = useRef<HTMLInputElement>(null);
	const valueRef = useRef<HTMLInputElement>(null);

	const [loading, toggleLoading] = useState(false);
	const [isOpen, setOpen] = useState(false);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(value) => {
				if (value === false && loading) return;
				setOpen(value);
			}}
		>
			<DialogTrigger asChild>
				<Button> Add Criteria</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="pb-2 border-b">
					<DialogTitle>New Evaluation Factor</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
						quas deserunt consequatur?
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-1">
						<Label htmlFor="name">Criteria Name</Label>
						<Input
							required
							id="name"
							ref={nameRef}
							placeholder="a unique name"
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="value">Criteria Value (%)</Label>
						<Input
							required
							id="value"
							type="number"
							ref={valueRef}
							placeholder="please enter your value between 1 - 100"
						/>
					</div>
					<div className="float-right">
						<Button
							onClick={() => {
								const name = nameRef.current?.value;
								const value = valueRef.current?.value;
								if (!name || !value) return;
								const cb = (open: boolean) => {
									toggleLoading(false);
									setOpen(open);
								};
								toggleLoading(true);
								addCriteria(name, value, cb);
							}}
						>
							Save Criteria
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
