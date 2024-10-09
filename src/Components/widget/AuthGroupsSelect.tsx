"use client";
import { getAuthGroupSelection } from "./actions";
import MultipleSelectBox from "../ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useQuery } from "@tanstack/react-query";

type SingleSelectProps = {
  isMulti: false;
  defaultValue?: Selection;
};
type MultiSelectProps = {
  isMulti: true;
  defaultValue?: any[];
};

type Props = {
  required?: boolean;
  disabled?: boolean;
  onChange?: (values: any) => void;
} & (SingleSelectProps | MultiSelectProps);

type Selection = {
  value: number;
  title: string;
};

export default function AuthGroupSelection(props: Props) {
  const groupQuery = useQuery({
    queryKey: ["auth-groups"],
    queryFn: async () => {
      const response = await getAuthGroupSelection();
      if (response.success) {
        const data: Selection[] = transformData(response.data);
        return data;
      }
      throw Response;
    },
  });

  if (!props.isMulti) {
    return (
      <Select
        defaultValue={props.defaultValue?.value.toString()}
        onValueChange={(value) => props.onChange?.(value)}
      >
        <SelectTrigger>Select Group</SelectTrigger>
        <SelectContent>
          {groupQuery.data?.map((group) => {
            return (
              <SelectItem
                key={group.value.toString()}
                value={group.value.toString()}
              >
                {group.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <MultipleSelectBox
        name="group_ids"
        options={groupQuery.data || []}
        defaultValues={transformData(props.defaultValue || [])}
      />
    </>
  );
}

function transformData(data?: any[]): Selection[] {
  return (
    data?.reduce((value, current) => {
      value.push({
        value: current.id,
        title: current.name,
      });
      return value;
    }, [] as Selection[]) || []
  );
}
