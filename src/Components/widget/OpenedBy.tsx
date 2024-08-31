import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Label } from "@/Components/ui/label";
import CACHE from "@/lib/caching";
import { cn } from "@/lib/ui/utils";
import { getRFQOpenedBy } from "./actions";

type Props = {
	isOpen?: boolean;
	rfq_id?: ID;
	label?: string;
	labelClass?: string;
};

export default function OpenedBy(props: Props) {
	const [data, setData] = useState<Person[]>([]);
	const tableRows = useRef<number>(3);
	const toastId = useRef<ID>(0);

	useEffect(() => {
		const fetchData = async () => {
			const i = "rfq__" + props.rfq_id;
			if (CACHE.has(i)) return setData(CACHE.get(i));

			const response = await getRFQOpenedBy(props.rfq_id);

			if (!response.success) {
				if (!toast.isActive(toastId.current))
					toastId.current = toast.error(response.message);
				return;
			}
			if (response.data[0]) {
				if (response.data.length >= 3) {
					tableRows.current = response.data.length;
				}
				CACHE.set(i, response.data, 45);
				setData(response.data);
			}
		};
		fetchData();
	}, [props.rfq_id]);

	const getPersonFromIndex = (index: number) => {
		return ((data && data[index]) || {}) as Person;
	};

	return (
		<div className="grid gap-2">
			<Label className={cn("font-semibold text-base", props.labelClass || "")}>
				{props.label || "Opened By"}
			</Label>
			<div className="table-wrapper">
				<table className="data-table w-full text-sm">
					<thead>
						<tr>
							<th className="w-[3ch]">
								<span className="inline-block text-xs">#</span>
							</th>
							<th>Employee ID</th>
							<th>Full Name</th>
							<th>Job Title</th>
							<th>Department</th>
						</tr>
					</thead>
					<tbody>
						{new Array(tableRows.current).fill(0).map((_, idx) => {
							const person = getPersonFromIndex(idx);
							return (
								<tr key={person.id || Math.random()}>
									<td className="text-xs">{idx + 1}</td>
									<td>{person.employee_id || "-"}</td>
									<td>{person.name || "-"}</td>
									<td>{person.job_title || "-"}</td>
									<td>{person.department?.name || "-"}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

type Person = {
	id: ID;
	employee_id?: string;
	name: string;
	job_title: string;
	department?: {
		id: ID;
		name: string;
	};
};
