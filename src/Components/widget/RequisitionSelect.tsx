import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
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

type Props = {
  required?: boolean;
  disabled?: boolean;
  setSelectedRequisition: any;
  defaultValue?: RequisitionSelect;
};

type RequisitionSelect = {
  id: ID;
  name: string;
};

export default function RequisitionSelect(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { required, disabled } = props;
  const [retrieve, setRetrieveRequisition] = useState(false);
  const [selectedRequisition, setSelectedRequisition] =
    useState<RequisitionSelect>();

  const requisitionQuery = useQuery({
    staleTime: Infinity,
    enabled: retrieve && !!selectedRequisition?.id,
    queryKey: ["requisition", selectedRequisition?.id],
    queryFn: async () => {
      const response = await retrieveRequisition(
        String(selectedRequisition?.id)
      );
      if (response.success) {
        props.setSelectedRequisition?.(response.data);
        return response.data as RequisitionRetrieve;
      }
      throw response;
    },
  });

  const requisitionSelectQuery = useQuery<RequisitionSelect[]>({
    staleTime: Infinity,
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
          <SelectValue placeholder={"Select an requisition"} />
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
                  {generate_unique_id("REQ", requisition.id)}
                  {" - "}
                  {requisition.name}
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
