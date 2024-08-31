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
import { getDepartmentSelection } from "./actions";
import { cn } from "@/lib/ui/utils";

type Props = {
	name: string;
	required?: boolean;
	disabled?: boolean;
	defaultValue?: string;
	triggerClassName?: string;
	contentClassName?: string;
};

type Selection = {
	id: ID;
	name: string;
};

export default function DepartmentSelection(props: Props) {
	const { disabled, required, defaultValue, name } = props;
	const [departments, setDepartments] = useState<Selection[] | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = CACHE.get("departments");
			if (data?.length) {
				setDepartments(data);
				return;
			}
			const response = await getDepartmentSelection();
			if (response.success) {
				CACHE?.set("departments", response.data ?? [], 30);
				setDepartments(response.data ?? []);
			}
		};
		fetchData();
	}, []);

	return (
		<Select
			key={defaultValue}
			name={name || `department`}
			defaultValue={String(defaultValue)}
			disabled={disabled}
			required={required}
		>
			<SelectTrigger
				className={cn("", props.triggerClassName)}
				disabled={disabled}
			>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent className={cn("", props.contentClassName)}>
				<SelectGroup className="">
					<SelectLabel className="">Select A Department</SelectLabel>
					{departments?.map((department: any) => {
						return (
							<SelectItem key={department.id} value={String(department.id)}>
								{department.name}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
