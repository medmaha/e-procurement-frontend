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

type Props = {
	defaultValue?: string;
};
export default function FilterByRFQ(props: Props) {
	const router = useRouter();

	function handleYearChange(rfq: string) {
		const url = new URL(location.href);
		url.searchParams.set("rfq", rfq);
		router.push(url.href);
	}

	return (
		<>
			<Select
				onValueChange={handleYearChange}
				defaultValue={props.defaultValue}
			>
				<SelectTrigger className="max-w-[150px]">
					<SelectValue placeholder="Filter by RFQ" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Filter By RFQ</SelectLabel>
						<SelectItem value={"all"}>All</SelectItem>
						<SelectItem value={"latest"}>Latest</SelectItem>
						<SelectItem value={"oldest"}>Oldest</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
}
