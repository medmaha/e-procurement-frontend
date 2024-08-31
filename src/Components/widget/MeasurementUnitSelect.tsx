import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/ui/utils";

type Props = {
	name?: string;
	disabled?: boolean;
	required?: boolean;
	value?: string;
	triggerClassName?: string;
	contentClassName?: string;
};

export default function MeasurementUnitSelection(props: Props) {
	const { disabled, required, value, name } = props;
	return (
		<Select
			defaultValue={value}
			disabled={disabled}
			required={required}
			name={name || "measurement_unit"}
		>
			<SelectTrigger
				className={cn("uppercase", props.triggerClassName)}
				// "bg-background text-sm p-0 px-1 h-[30px] rounded-none disabled:pointer-events-none"
				disabled={disabled}
			>
				<SelectValue placeholder="-------" />
			</SelectTrigger>
			<SelectContent className={cn("", props.contentClassName)}>
				<SelectGroup className="">
					<SelectLabel className="">Unit Of Measurements</SelectLabel>
					{UNITS_TYPES.map((type) => {
						return (
							<SelectItem key={type} value={type} className="capitalize">
								{type}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

const UNITS_TYPES = [
	"units",
	"pieces",
	"bundles",
	"bytes",
	"litres",
	"metres",
	"inches",
];
