import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { getRequisitionSelection } from "./actions";
import { generate_unique_id } from "@/lib/helpers/generator";
import { retrieveRequisition } from "@/app/procurement/requisitions/actions";
import { format } from "date-fns";

type Props = {
  required?: boolean;
  disabled?: boolean;
  setSelectedRequisition: any;
  defaultValue?: RequisitionSelect;
};

type RequisitionSelect = {
  id: ID;
  name: string;
  created_date: string;
};

export default function RequisitionSelect(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { required, disabled } = props;
  const [retrieve, setRetrieveRequisition] = useState(false);
  const [selectedRequisition, setSelectedRequisition] =
    useState<RequisitionSelect>();

  const { data } = useQuery({
    staleTime: Infinity,
    enabled: retrieve && !!selectedRequisition?.id,
    queryKey: ["requisition", selectedRequisition?.id],
    queryFn: async () => {
      const response = await retrieveRequisition(
        String(selectedRequisition?.id)
      );
      if (response.success) {
        return response.data;
      }
      throw response;
    },
  });

  useEffect(() => {
    if (data) {
      props.setSelectedRequisition?.(data);
    }
  }, [data]);

  const requisitionSelectQuery = useQuery<RequisitionSelect[]>({
    staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: isOpen || !!props.defaultValue,
    queryKey: ["requisitions", "select", props.defaultValue?.id],
    queryFn: async () => {
      const response = await getRequisitionSelection();
      if (response.success) {
        if (props.defaultValue) {
          return [props.defaultValue, ...response.data];
        }
        return response.data;
      }
      throw response;
    },
  });

  function onItemSelect(item?: RequisitionSelect) {
    if (!item) return;
    setRetrieveRequisition(true);
    setSelectedRequisition(item);
  }

  const getDefaultValue = useCallback(
    function () {
      if (!props.defaultValue?.id) return;
      if (requisitionSelectQuery?.data) {
        return requisitionSelectQuery.data
          .find((i) => i.id.toString() === props.defaultValue?.id.toString())
          ?.id.toString();
      }
    },
    [props.defaultValue?.id, requisitionSelectQuery?.data]
  );

  const defaultValue = getDefaultValue();

  return (
    <>
      <Select
        open={isOpen}
        disabled={disabled}
        required={required}
        name="requisition_id"
        key={JSON.stringify(requisitionSelectQuery?.data)}
        defaultValue={defaultValue}
        onOpenChange={(opened) => {
          setIsOpen(opened);
        }}
        onValueChange={(value) => {
          onItemSelect(
            requisitionSelectQuery?.data?.find((i) => i.id.toString() === value)
          );
        }}
      >
        {/* TODO: Display a select placeholder */}
        <SelectTrigger
          className="bg-background h-full text-sm disabled:pointer-events-none"
          disabled={disabled}
        >
          {selectedRequisition ? (
            <div className="inline-flex w-full gap-2 items-center truncate pr-8">
              <span>{generate_unique_id("PR", selectedRequisition.id)}</span>
              <small className="text-muted-foreground">
                ({format(new Date(selectedRequisition.created_date), "Pp")})
              </small>
            </div>
          ) : (
            <SelectValue placeholder={"Select an requisition"} />
          )}
        </SelectTrigger>
        <SelectContent className="p-0 m-0 w-full min-h-[80px]">
          <SelectGroup className="m-0 p-1">
            <SelectLabel className="px-4" asChild>
              {requisitionSelectQuery.isLoading ? (
                <div className="min-w-[200px] min-h-[150px] flex items-center justify-center">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">
                  {requisitionSelectQuery?.data &&
                  requisitionSelectQuery.data.length < 1
                    ? "No Requisitions For RFQ"
                    : "Requisitions approved for RFQ"}
                </span>
              )}
            </SelectLabel>
            {requisitionSelectQuery.data?.map((requisition) => {
              return (
                <SelectItem key={requisition.id} value={String(requisition.id)}>
                  <div className="inline-grid">
                    {generate_unique_id("PR", requisition.id)}
                    <div className="space-y-1 grid">
                      <span className="text-xs text-muted-foreground inline-block truncate">
                        {requisition.name}
                      </span>
                      <span className="text-xs text-muted-foreground inline-block truncate">
                        <small>
                          {format(new Date(requisition.created_date), "PPPPp")}
                        </small>
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
            {requisitionSelectQuery?.data &&
              requisitionSelectQuery.data.length < 1 && (
                <SelectItem
                  value="------"
                  className="text-muted-foreground w-full text-center focus:bg-transparent"
                >
                  There are currently no requisition for rfq yes
                </SelectItem>
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
