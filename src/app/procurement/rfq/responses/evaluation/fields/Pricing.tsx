"use client";
import { Input } from "@/Components/ui/input";
import { useRef } from "react";

type Props = {
	disabled: boolean;
	isRejected: boolean;
	defaultValue?: NumberOrString;
	updateData: (value: number) => void;
};

export default function Pricing(props: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<Input
		min={0}
		name="pricing"
			ref={inputRef}
			className={`w-[12ch] ${props.isRejected ? "cursor-not-allowed placeholder:text-destructive" : ""}`}
			type="number"
			title={inputRef.current?.value}
			placeholder="GMD"
			disabled={props.disabled}
			onInput={({ currentTarget }) => {
				const value = Number(currentTarget.value);
				if (isNaN(value)) return;

				if (value < 0 && inputRef.current) {
					inputRef.current.value = "0";
					props.updateData(0);
					return;
				}
				props.updateData(value);
			}}
			defaultValue={props.defaultValue}
		/>
	);
}
