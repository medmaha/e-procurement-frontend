"use client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { useRouter } from "next/navigation";

const thisYear = String(new Date().getFullYear());

export default function FilterByYear({ disabled, required, value }: any) {
	const router = useRouter();
	function handleYearChange(year: string) {
		if (value === year) return;
		router.push("?year=" + year);
	}
	return (
		<Select
			onValueChange={handleYearChange}
			defaultValue={value ?? thisYear}
			disabled={disabled}
			required={required}
			name={`year`}
		>
			<SelectTrigger
				className="bg-transparent text-xl disabled:pointer-events-none"
				disabled={disabled}
			>
				<SelectValue placeholder={"Select an option"} />
			</SelectTrigger>
			<SelectContent className="p-0 m-0 min-w-[100px] max-w-[100px]">
				<SelectGroup className="m-0 p-1">
					{getInitialYears().map((year) => {
						return (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function getInitialYears() {
	// from 2010 to 2024
	const startYear = 2010;
	const span = Number(thisYear) - startYear;
	return Array.from({ length: span + 1 }, (_, i) => String(2010 + i)).reverse();
}
