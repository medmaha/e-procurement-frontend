import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { retrieveRequisition } from "@/app/procurement/requisitions/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import CACHE from "@/lib/caching";
import { transformToArray } from "@/lib/helpers";
import { getRequisitionSelection } from "./actions";

type Props = {
  open: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fetchRequisition?: {
    cb: (data?: any) => void;
  };
  defaultValue?: RequisitionSelect;
};

type RequisitionSelect = {
  id: ID;
  unique_id: string;
};

export default function RequisitionSelect(props: Props) {
  const { required, disabled } = props;
  const toastId = useRef<ID>(0);
  const [requisitions, setRequisitions] = useState<RequisitionSelect[]>(
    props.defaultValue
      ? [{ id: props.defaultValue.id, unique_id: props.defaultValue.unique_id }]
      : []
  );

  const fetchRequisitions = useCallback(async () => {
    const t = () => {
      if (toast.isActive(toastId.current)) return;
      toastId.current = toast.info(
        "There are no requisitions available for rfq currently.",
        {
          position: "top-center",
          hideProgressBar: true,
          autoClose: 3000,
        }
      );
    };

    if (props.readOnly) {
      const data = transformToArray(props.defaultValue);
      CACHE?.set("requisitions", data);
      setRequisitions(data);
      return;
    }

    if (props.open && CACHE.has("requisitions")) {
      return setRequisitions(CACHE.get("requisitions"));
    }
    const response = await getRequisitionSelection();
    if (response.success) {
      const data = [...response.data];
      if (props.defaultValue) data.unshift(props.defaultValue);
      CACHE?.set("requisitions", data, 30);
      setRequisitions(data);
      if (!props.defaultValue && response.data.length < 1) {
        t();
      }
    }
  }, [props.open, props.readOnly, props.defaultValue]);

  useEffect(() => {
    fetchRequisitions();
    if (!CACHE.has("selected")) CACHE.set("selected", {}, 30);
    return () => {
      CACHE?.delete("selected");
      if (toast.isActive(toastId.current)) toast.dismiss(toastId.current);
    };
  }, [fetchRequisitions]);

  const getRequisitionData = async (value: string) => {
    // check cache first before fetching from server
    if (!value) {
      if (props.fetchRequisition) props.fetchRequisition.cb();
      return;
    }
    // check get or set selected requisition from cached
    const cached = CACHE.has("selected_requisition")
      ? CACHE.get("selected_requisition")!
      : (() => {
          CACHE?.set("selected_requisition", {});
          return {};
        })();

    if (props.fetchRequisition) {
      const foundCached = cached[value];
      if (foundCached) return props.fetchRequisition.cb(foundCached);

      const response = await retrieveRequisition(value);

      if (response.success) {
        cached[value] = response.data;
        CACHE?.set("selected_requisition" + value, cached);
        return props.fetchRequisition.cb(response.data);
      }
      toast.error(response.message, {
        position: "top-center",
        hideProgressBar: true,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Select
        defaultValue={props.defaultValue && String(props.defaultValue.id)}
        disabled={disabled}
        required={required}
        name="requisition_id"
        onValueChange={(value) => getRequisitionData(value)}
      >
        {/* TODO: Display a select placeholder */}
        <SelectTrigger
          className="bg-background h-full text-sm disabled:pointer-events-none"
          disabled={disabled}
        >
          <SelectValue placeholder={"Select an requisition"} />
        </SelectTrigger>
        <SelectContent className="p-0 m-0 w-full">
          <SelectGroup className="m-0 p-1">
            <SelectLabel className="px-4">
              {"Requisitions approved for RFQ"}
            </SelectLabel>
            {requisitions?.map((requisition) => {
              return (
                <SelectItem key={requisition.id} value={String(requisition.id)}>
                  {requisition.unique_id}
                </SelectItem>
              );
            })}
            {requisitions?.length < 1 && (
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
