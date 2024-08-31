"use client";
import React, { useEffect, useState } from "react";
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
import { getStaffSelections } from "./actions";

type Props = {
	name: string;
	required?: boolean;
	disabled?: boolean;
	defaultValue?: string;
};

export default function StaffsSelect(props: Props) {
	const { name, disabled, required, defaultValue } = props;
	const [staffs, setStaffs] = useState<any[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const cached = CACHE.get("staffs");
			if (cached?.length) {
				return setStaffs(cached);
			}
			const response = await getStaffSelections();
			if (response.success) {
				console.log(response.data);
				CACHE?.set("staffs", response.data);
				setStaffs(response.data);
			}
		};
		fetchData();
	}, []);

	return (
		<Select
			key={props.defaultValue}
			defaultValue={props.defaultValue}
			disabled={disabled}
			required={required}
			name={name}
		>
			<SelectTrigger
				className="bg-background text-sm disabled:pointer-events-none"
				disabled={disabled}
			>
				<SelectValue placeholder={"Select an option"} />
			</SelectTrigger>
			<SelectContent className="p-0 m-0 w-full">
				<SelectGroup className="m-0 p-1">
					<SelectLabel className="px-4">
						{staffs.length ? "Select a Staff" : "No staff found"}
					</SelectLabel>
					{staffs.map((staff) => {
						return (
							<SelectItem key={staff.id} value={String(staff.id)}>
								{staff.name || staff.first_name + " " + staff.last_name}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
