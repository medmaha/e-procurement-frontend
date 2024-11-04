"use client";
import { getVendorSelection } from "./actions";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/Components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { SelectGroup } from "@radix-ui/react-select";

type SingleSelect = {
  isMulti?: false;
  defaultValue?: ID;
  onValueChange?: (value: ID) => void;
};
type MultipleSelect = {
  isMulti: true;
  defaultValue?: ID[];
  onValueChange?: (value: ID[]) => void;
};

type Props = {
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
} & (SingleSelect | MultipleSelect);

type SupplierSelectItem = {
  id: ID;
  name: string;
};

export default function SupplierSelect(props: Props) {
  const [open, setOpen] = useState(false);

  const vendorsQuery = useQuery({
    enabled: !!props.defaultValue || open,
    queryKey: ["vendors"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await getVendorSelection();
      if (response.success) {
        return transformData(response.data);
      }
      throw new Error("Failed to fetch vendors");
    },
  });

  return (
    <>
      {props.isMulti && (
        <MultipleSelectBox
          id={props.id}
          name={props.name}
          options={vendorsQuery.data || []}
          values={props.defaultValue}
          onValueChange={(values) => props.onValueChange?.(values)}
          onOpenChange={(opened) => setOpen(opened)}
        />
      )}

      {!props.isMulti && (
        <SingleSelectBox
          id={props.id}
          name={props.name}
          onOpenChange={(opened) => setOpen(opened)}
          key={vendorsQuery.data?.length}
          options={vendorsQuery.data || []}
          value={props.defaultValue}
          onValueChange={(values) => props.onValueChange?.(values)}
        />
      )}
    </>
  );
}

type SelectBoxProps = {
  id?: string;
  name?: string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  options: TransformedData[];
  onOpenChange: (opened: boolean) => void;
};

interface SingleSelectBoxProps extends SelectBoxProps {
  value?: ID;
  onValueChange: (value: ID) => void;
}

function SingleSelectBox({ value, ...props }: SingleSelectBoxProps) {
  
  return (
    <Select
      key={value?.toString()}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
      defaultValue={value?.toString()}
      onValueChange={(value) => props.onValueChange(value.toString())}
      onOpenChange={(opened) => props.onOpenChange(opened)}
    >
      <SelectTrigger id={props.id}>
        <SelectValue placeholder="Select a supplier" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            {props.loading && (
              <div className="flex justify-center items-center h-10">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {!props.loading && (
              <>
                {props.options.length > 0 ? (
                  <span className="text-muted-foreground">
                    Select a supplier
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    No suppliers found
                  </span>
                )}
              </>
            )}
          </SelectLabel>
          {(props.options).map((option, i) => (
            <SelectItem
              className="capitalize"
              key={option.value}
              value={option.value.toString()}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface MultipleSelectBoxProps extends SelectBoxProps {
  values?: ID[];
  onValueChange: (value: ID[]) => void;
}

function MultipleSelectBox({ values, ...props }: MultipleSelectBoxProps) {
  return (
    <MultiSelector
      loop={false}
      name={props.name}
      values={values?.map((value) => value.toString()) || []}
      onValuesChange={(values) =>
        props.onValueChange(values.map((value) => value.toString()))
      }
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput
          id={props.id}
          disabled={props.disabled}
          required={props.required}
          placeholder="Select your framework"
        />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {props.options.map((option, i) => (
            <MultiSelectorItem key={i} value={option.value.toString()}>
              {option.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
}

type TransformedData = {
  label: string;
  value: string | number;
};

function transformData(data?: SupplierSelectItem[]) {
  return data?.reduce((value, current) => {
    value.push({
      value: current.id,
      label: current.name,
    });
    return value;
  }, [] as TransformedData[]);
}
