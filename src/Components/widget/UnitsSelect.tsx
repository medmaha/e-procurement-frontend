"use client";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import CACHE from "@/lib/caching";
import { getUnitSelection } from "./actions";

type UnitSelect = {
	id: ID;
	name: string;
	department: string;
};

type Props = {
	name?: string;
	open: boolean;
	required?: boolean;
	disabled?: boolean;
	defaultValue?: string;
};

export default function UnitsSelect(props: Props) {
	const { disabled, required } = props;
	const [units, setUnit] = useState<UnitSelect[]>([]);

	useEffect(() => {
		const fetchUnits = async () => {
			const cache_key = "units";
			const cached = CACHE.get(cache_key);
			if (cached?.length) {
				return setUnit(cached);
			}
			const response = await getUnitSelection();

			if (response.success) {
				CACHE?.set(cache_key, response.data ?? []);
				setUnit(response.data ?? []);
			}
		};
		fetchUnits();
	}, []);

	return (
		<Select
			key={props.defaultValue}
			defaultValue={props.defaultValue && String(props.defaultValue)}
			name={props.name || "unit"}
			disabled={disabled}
			required={required}
		>
			<SelectTrigger
				className="bg-background text-sm disabled:pointer-events-none"
				disabled={disabled}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent className="p-0 m-0 w-full">
				<SelectGroup className="m-0 p-1">
					<SelectLabel className="px-4">Select A Department</SelectLabel>
					{units?.map((unit) => {
						return (
							<SelectItem key={unit.id} value={String(unit.id)}>
								{unit.name}
								{/* <div className="flex items-center gap-4 justify-between w-full">
									<span>{unit.name}</span>
									<span>{" - "}</span>
									<span>{unit.department}</span>
								</div> */}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
