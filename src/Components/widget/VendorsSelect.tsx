"use client";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from "react-select";
import CACHE from "@/lib/caching";
import { getVendorSelection } from "./actions";

type Props = {
  isMulti?: boolean;
  open: boolean;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: SupplierSelect[];
};

type SupplierSelect = {
  id: ID;
  name: string;
};

export default function SupplierSelect(props: Props) {
  const { required, disabled, isMulti } = props;

  const [selected, setSelected] = useState<string[] | null>(null);
  const [values, setValues] = useState<TransformedData[] | undefined>();

  const [groups, setGroups] = useState<TransformedData[]>([]);

  const fetchGroups = useCallback(async () => {
    const cached = CACHE.get("groups");
    if (cached) {
      return setGroups(cached);
    }
    const response = await getVendorSelection();
    if (response.success) {
      const data = transformData(response.data);
      if (data) {
        CACHE?.set("groups", data, 45);
        console.log(data);
        setGroups(data);
      }
    }
  }, []);

  useEffect(() => {
    setSelected(defaultSelected(props.defaultValue));
    setValues(defaultValues(props.defaultValue));
  }, [props.defaultValue]);

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
      <input hidden name="suppliers" defaultValue={selected?.join(",")} />

      <ReactSelect
        options={groups}
        placeholder="Select multiple vendors"
        required={required}
        value={values}
        isDisabled={disabled}
        closeMenuOnSelect={isMulti ? false : true}
        isMulti={isMulti}
        isClearable={false}
        classNamePrefix="react-select"
        classNames={{
          container: ({}) => {
            return "bg-red-500 border rounded-md";
          },
          input: ({}) => {
            return "bg-none";
          },
          placeholder: ({}) => {
            return "";
          },
          menuList: () => {
            return "border left-0";
          },
          singleValue: () => {
            return "border hover:bg-secondary";
          },
          control: (state) =>
            state.isFocused
              ? "border-red-600 bg-secondary"
              : "border-grey-300 bg-secondary",
        }}
        onChange={handleSelectChange}
      />
    </>
  );
}

type TransformedData = {
  label: string;
  value: string | number;
};

function defaultSelected(data?: SupplierSelect[]) {
  return (
    data?.reduce((value, current) => {
      value.push(String(current.id));
      return value;
    }, [] as string[]) ?? []
  );
}
function defaultValues(data?: SupplierSelect[]) {
  return transformData(data);
}

function transformData(data?: SupplierSelect[]) {
  return data?.reduce((value, current) => {
    value.push({
      value: current.id,
      label: current.name,
    });
    return value;
  }, [] as TransformedData[]);
}
