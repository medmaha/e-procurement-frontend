import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@/Components/ui/select";

import { StarIcon } from "lucide-react";

type Props = {
	disabled: boolean;
	updateData: (value: number) => void;
	defaultValue?: NumberOrString;
};

export default function Rating(props: Props) {
	const [selected, setSelected] = useState<string>(
		String(props.defaultValue || "3")
	);
	return (
		<>
			<p className="inline-flex items-center gap-2 text-sm">
				<span>Rating:</span>
				<Select
					key={props.defaultValue}
					onValueChange={(value) => {
						const _value = Number(value);
						if (isNaN(_value)) return;

						if (_value < 1) {
							setSelected("3");
							props.updateData(0);
							return;
						}
						if (_value > 5) {
							setSelected("3");
							props.updateData(0);
							return;
						}
						setSelected(value);
						props.updateData(_value);
					}}
					defaultValue={String(props.defaultValue)}
					// disabled={props.disabled}
				>
					<SelectTrigger
						disabled={props.disabled}
						className="inline-flex items-center gap-0.5 w-[70px]"
					>
						<span className={`${selected ? "" : "text-muted-foreground"}`}>
							{selected || "---"}
						</span>
						{selected && (
							<StarIcon width={12} height={12} className="text-sky-500_" />
						)}
					</SelectTrigger>
					<SelectContent className="">
						<SelectGroup>
							{new Array(5).fill(0).map((_, i) => (
								<SelectItem
									key={i}
									value={String(i + 1)}
									className="px-1 text-sky-500"
								>
									<div className="inline-flex items-center gap-0.5 w-full pl-6">
										{new Array(i + 1).fill(0).map((_, j) => (
											<StarIcon key={j} width={14} height={15} />
										))}
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</p>
		</>
	);
}
