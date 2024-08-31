import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Label } from "@/Components/ui/label";
import { getPermissions } from "../actions";
import { Permission } from "../types";
import CACHE from "@/lib/caching";

type Props = {
	perms?: Permission[];
};

export default function PermissionSelector({  perms }: Props) {
	const [permissions, setPermissions] = useState([] as Permission[]);
	const [selected, setSelected] = useState([] as string[]);

	useEffect(() => {
		if (perms) {
			const items = perms.reduce((value, current) => {
				value.push(current.id.toString());
				return value;
			}, [] as string[]);
			setSelected(items);
		}
	}, [perms]);

	// Gets the permissions from the server
	useEffect(() => {
		const fetchData = async () => {
			const data = CACHE.get("groups");
			if (CACHE.has("groups") && data?.length) {
				setPermissions(data);
				return;
			}
			const response = await getPermissions();

			if (response.success) {
				const _g = response.data?.reduce((value: any, current: any) => {
					value.push({
						label: cleanText(current.name),
						value: current.id,
					});
					return value;
				}, [] as { label: string; value: string }[]);
				CACHE?.set("groups", _g ?? [], 60 * 60 * 24);
				setPermissions(_g ?? []);
			}
		};
		fetchData();
	}, []);

	function getDefaultValues() {
		if (!perms) return [];
		const items = perms.reduce((value: any, current: any) => {
			value.push({
				label: cleanText(current.name),
				value: current.id,
			});
			return value;
		}, [] as { label: string; value: string }[]);

		return items;
	}

	return (
		<div className="grid gap-1 w-full">
			<Label>Select Permissions</Label>
			<input hidden name="permissions" value={selected.join(",")} />
			<ReactSelect
				isMulti
				defaultValue={getDefaultValues()}
				closeMenuOnSelect={false}
				options={permissions}
				onChange={(value: any) => {
					setSelected(
						value.reduce((_value: any, current: any, idx: number) => {
							_value.push(current.value);
							return _value;
						}, [])
					);
				}}
				className="basic-multi-select capitalize focus:outline-none border-none focus-within:border-none focus-within:ring-2 rounded ring-offset-2 ring-primary"
				classNamePrefix="select"
			/>
		</div>
	);
}

function cleanText(text: string) {
	text = text.replace(/can/i, " ");
	text = text.replace("_", " ");
	// text = text.replace("add", "create");
	text = text.replace("change", "update");
	text = text.replace("delete", "disable");
	return text;
}
