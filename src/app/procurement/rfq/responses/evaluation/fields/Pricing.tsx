"use client";
import { Input } from "@/Components/ui/input";
import { useRef } from "react";

type Props = {
	disabled: boolean;
	defaultValue?: NumberOrString;
	updateData: (value: number) => void;
};

export default function Pricing(props: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<Input
			ref={inputRef}
			className="min-w-[80px] w-max"
			type="number"
			min={0}
			title={inputRef.current?.value}
			placeholder="GMD"
			disabled={props.disabled}
			onInput={({ currentTarget }) => {
				console.log(currentTarget.value);
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
