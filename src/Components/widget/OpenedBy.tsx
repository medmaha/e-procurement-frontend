import { useMemo } from "react";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/ui/utils";
import { getRFQOpenedBy } from "./actions";
import { ColumnDef } from "@tanstack/react-table";
import { generate_unique_id } from "@/lib/helpers/generator";
import Link from "next/link";
import TabularData from "./TabularData";
import { useQuery } from "@tanstack/react-query";

type Props = {
  isOpen?: boolean;
  rfq_id?: ID;
  label?: string;
  labelClass?: string;
};

export default function OpenedBy(props: Props) {
  const columns = useMemo(() => {
    return openedBColumns;
  }, []);

  const personsQuery = useQuery({
    enabled: !!props.rfq_id || props.isOpen,
    queryKey: ["rfq", props.rfq_id, "persons"],
    queryFn: async () => {
      const response = await getRFQOpenedBy(props.rfq_id);

      if (!response.success) throw response;

      if (Array.isArray(response.data)) {
        if (response.data.length < 3) {
          let i = 3 - response.data.length;
          return [
            ...response.data,
            ...Array(i).fill({
              department: {},
            }),
          ];
        }
        return response.data;
      }
      return [];
    },
  });

  return (
    <div className="grid gap-2">
      <Label className={cn("font-semibold text-base", props.labelClass || "")}>
        {props.label || "Opened By"}
      </Label>
      <TabularData
        columns={columns}
        data={personsQuery.data}
        loading={personsQuery.isLoading}
        wrapperClassName="min-h-[150px]"
        emptyMessage="No Staffs Found"
      />
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

const openedBColumns = [
  {
    accessorKey: "id",
    header: "Reference",
    cell: ({ row: { original } }) =>
      original.id && generate_unique_id("EMP", original.id),
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    accessorKey: "department?.name",
    header: "Department",
    cell: ({ row: { original } }) => {
      if (!original.department) return "N/A";
      return (
        <Link
          href={`/organization/departments/${original.department?.id}`}
          className="p-2.5"
        >
          {original.department?.name}
        </Link>
      );
    },
  },
] as ColumnDef<Person>[];
