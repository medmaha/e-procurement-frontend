"use client";
import { useCallback, useEffect, useState } from "react";
import { getAuthGroupSelection } from "./actions";
import MultipleSelectBox from "../ui/multi-select";

type Props = {
  isMulti?: boolean;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: Selection[];
  onChange?: (values: any) => void;
};

type Selection = {
  value: number;
  title: string;
};

export default function AuthGroupSelection(props: Props) {
  const { required, disabled, isMulti = true } = props;

  const [selected, setSelected] = useState<string[] | null>(null);
  const [values, setValues] = useState<
    TransformedSelection[] | TransformedSelection | undefined
  >();

  const [groups, setGroups] = useState<TransformedSelection[]>([]);

  const fetchGroups = useCallback(async () => {
    const response = await getAuthGroupSelection();
    if (response.success) {
      const data = transformData(response.data);
      if (data) {
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
      const s = (data as TransformedSelection[]).map((v) => String(v.value));
      setSelected(s);
    } else {
      setSelected([String(data.value)]);
    }
  }

  return (
    <>
      <input hidden name="group_ids" defaultValue={selected?.join(",")} />

      <MultipleSelectBox
        options={groups}
        name=""
        defaultValues={
          Array.isArray(props.defaultValue)
            ? transformData(props.defaultValue)
            : props.defaultValue && transformData([props.defaultValue])
        }
        onValueChange={(values) => {
          handleSelectChange(values);
        }}
      />
    </>
  );
}

type TransformedSelection = {
  title: string;
  value: string | number;
};

function defaultSelected(data?: Selection[]) {
  return (
    data?.reduce((value, current) => {
      value.push(String(current.value));
      return value;
    }, [] as string[]) ?? []
  );
}
function defaultValues(data?: Selection[], isMulti?: boolean) {
  if (isMulti) return transformData(data);
  return transformData(data)?.at(0);
}

function transformData(data?: any[]) {
  return data?.reduce((value, current) => {
    value.push({
      value: current.id,
      title: current.name,
    });
    return value;
  }, [] as TransformedSelection[]);
}
function transformBackData(data?: TransformedSelection[]) {
  return data?.reduce((value, current) => {
    value.push({
      value: Number(current.value),
      title: current.title,
    });
    return value;
  }, [] as Selection[]);
}
