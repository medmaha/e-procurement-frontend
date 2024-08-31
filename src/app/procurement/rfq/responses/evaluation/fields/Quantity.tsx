"use client";
import { Input } from "@/Components/ui/input";

type Props = {
	disabled: boolean;
	defaultValue?: number;
	updateData: (value: number) => void;
};

export default function Quantity(props: Props) {
	return (
		<Input
			className="w-[80px]"
			type="number"
			min={0}
			disabled={props.disabled}
			onInput={(target) => {
				const value = Number((target as any).value);
				if (isNaN(value)) return;

				if (value < 0) {
					(target as any).value = 0;
					props.updateData(0);
					return;
				}
				props.updateData(value);
			}}
			defaultValue={props.defaultValue}
		/>
	);
}
