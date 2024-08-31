"use client";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";
import CACHE from "@/lib/caching";
import { getAuthGroupSelection } from "./actions";

type Props = {
	isMulti?: boolean;
	required?: boolean;
	disabled?: boolean;
	defaultValue?: Selection[];
};

type Selection = {
	id: number;
	name: string;
};

export default function AuthGroupSelection(props: Props) {
	const { required, disabled, isMulti = true } = props;

	const [selected, setSelected] = useState<string[] | null>(null);
	const [values, setValues] = useState<
		TransformedData[] | TransformedData | undefined
	>();
	const [groups, setGroups] = useState<TransformedData[]>([]);

	const fetchGroups = useCallback(async () => {
		const _groups = CACHE.get("groups");
		if (_groups?.length) {
			return setGroups(_groups);
		}
		const response = await getAuthGroupSelection();
		if (response.success) {
			const data = transformData(response.data);
			if (data) {
				CACHE?.set("groups", data);
				setGroups(data);
			}
		}
	}, []);

	useEffect(() => {
		setSelected(defaultSelected(props.defaultValue));
		setValues(defaultValues(props.defaultValue, isMulti));
	}, [props.defaultValue, isMulti]);

	useEffect(() => {
		fetchGroups();
	}, [fetchGroups]);

	function handleSelectChange(data: any) {
		setValues(data);
		if (Array.isArray(data)) {
			const s = (data as TransformedData[]).map((v) => String(v.value));
			setSelected(s);
		}
	}

	return (
		<>
			<input hidden name="group_ids" defaultValue={selected?.join(",")} />
			<ReactSelect
				options={groups}
				required={required}
				value={values}
				isDisabled={disabled}
				closeMenuOnSelect={isMulti ? false : true}
				isMulti={isMulti}
				isClearable={false}
				onChange={handleSelectChange}
			/>
		</>
	);
}

type TransformedData = {
	label: string;
	value: string | number;
};

function defaultSelected(data?: Selection[]) {
	return (
		data?.reduce((value, current) => {
			value.push(String(current.id));
			return value;
		}, [] as string[]) ?? []
	);
}
function defaultValues(data?: Selection[], isMulti?: boolean) {
	if (isMulti) return transformData(data);
	return transformData(data)?.at(0);
}

function transformData(data?: Selection[]) {
	return data?.reduce((value, current) => {
		value.push({
			value: current.id,
			label: current.name,
		});
		return value;
	}, [] as TransformedData[]);
}
