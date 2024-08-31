"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type Props = {
	defaultValue?: string;
};

export default function FilterByRFQ(props: Props) {
	const options = useMemo(() => {
		const start = 2010;
		const end = new Date().getFullYear();
		const data = [];
		for (let i = start; i < end; i++) {
			data.push(String(i + 1));
		}
		return data.reverse();
	}, []);

	const router = useRouter();

	function handleYearChange(year: string) {
		let today = props.defaultValue || new Date().getFullYear().toString();
		const url = new URL(location.href);
		url.searchParams.set("year", year || today);
		router.push(url.href);
	}

	return (
		<Select onValueChange={handleYearChange} defaultValue={props.defaultValue}>
			<SelectTrigger className="max-w-[150px]">
				<SelectValue placeholder="Filter By Year" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Filter By Year</SelectLabel>
					{options.map((year) => {
						return (
							<SelectItem key={year} value={String(year)}>
								{year}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
