import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@radix-ui/react-label";
import MeasurementUnitSelection from "@/Components/widget/MeasurementUnitSelect";

type RFQItemProps = {
  idx: number;
  isLast?: boolean;
  defaultValue: boolean;
  data?: RFQItem | RequisitionItem;
  remove: () => void;
  disabled?: boolean;
};

export default function RFQItem({
  idx,
  data,
  remove,
  isLast,
  defaultValue,
  ...props
}: RFQItemProps) {
  const { pending } = useFormStatus();
  const tid = useRef(0);
  const timeout = useRef<any>(0);

  useEffect(() => {
    const cleanup = () => {
      clearTimeout(timeout.current);
      toast.dismiss(tid.current ?? localStorage.getItem("toastId"));
    };

    cleanup();
    return cleanup;
  }, []);

  return (
    // Your JSX structure for the RFQItem component
    // Update fields and interactions to align with RFQItem attributes
    <div className="grid grid-cols-[10px,1fr,auto] w-full">
      <p className="text-xs">
        <span className="inline-flex items-center justify-center h-full w-full">
          <small
            className={`${idx === 0 ? "mt-5" : ""}
					`}
          >
            {idx + 1}.
          </small>
        </span>
      </p>
      <div className={`grid grid-cols-10 gap-1.5 px-1`}>
        {rfqItemFields.map((field) => (
          <div
            className={`${field.type === "text" ? "col-span-2" : ""} pb-1`}
            key={field.name}
          >
            <input hidden name={`${idx + 1}-id`} defaultValue={data?.id} />
            {idx === 0 && (
              <Label className="capitalize text-sm pb-2 inline-block">
                {field.label}{" "}
                {field.required && (
                  <span
                    title={`${field.label} field is required`}
                    className="pt-2 text-primary font-bold"
                  >
                    *
                  </span>
                )}
              </Label>
            )}{" "}
            {field.type !== "select" ? (
              <Input
                required={field.readonly}
                type={field.type}
                readOnly={
                  field.name === "eval_criteria"
                    ? false
                    : props.disabled || field.required
                }
                disabled={field.disabled || pending}
                name={`${idx + 1}-${field.name}`}
                autoFocus={isLast && field.name === "item_description"}
                placeholder={field.placeholder}
                defaultValue={
                  !!(
                    data &&
                    !["unit_cost", "total_cost", "remarks"].includes(field.name)
                  )
                    ? (data as any)[
                        field.name === "item_description"
                          ? defaultValue
                            ? "description"
                            : "item_description"
                          : field.name
                      ]
                    : undefined
                }
                className={`${
                  field.type === "text" ? "min-w-[130px]" : ""
                }  rounded-none disabled:pointer-events-none disabled:bg-accent`}
              />
            ) : (
              <>
                {field.selector && (
                  <field.selector
                    idx={idx}
                    required={field.required}
                    readOnly={props.disabled || field.required}
                    disabled={field.disabled || pending}
                    pending={pending}
                    value={
                      data ? (data as any)[field.name.toLowerCase()] : undefined
                    }
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="">
        <div className="inline-flex items-center justify-center h-full w-full">
          <Button
            title="Remove"
            type="button"
            disabled={pending}
            className={`${
              idx === 0 ? "mt-5" : ""
            } w-6 hover:bg-destructive hover:opacity-90 h-6 p-1 bg-destructive text-destructive-foreground rounded-full  disabled:pointer-events-none
					`}
            onClick={remove}
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
}

type RFQItemField = {
  type: "text" | "number" | "select"; // Update as per your field types
  name: string;
  label: string;
  required?: boolean;
  selector?: React.ComponentType<any>; // If it's a custom selector component
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
};

const rfqItemFields: RFQItemField[] = [
  {
    type: "text",
    name: "item_description",
    label: "Item Description",
    required: true,
  },
  {
    type: "number",
    name: "quantity",
    required: true,
    label: "Quantity",
  },
  {
    type: "select",
    name: "measurement_unit",
    label: "M-Unit",
    required: true,
    selector: MeasurementUnitSelection, // Replace with your custom selector component
    placeholder: "$", // Replace with appropriate placeholder text
  },
  {
    type: "text",
    name: "eval_criteria",
    label: "Evaluation Criteria",
  },
  {
    type: "number",
    name: "unit_cost",
    label: "Unit Price",
    disabled: true,
    readonly: true,
  },
  {
    type: "number",
    name: "total_cost",
    label: "Total Cost",
    disabled: true,
    readonly: true,
  },
  {
    type: "text",
    name: "remarks",
    label: "Remarks",
    disabled: true,
    readonly: true,
  },
  // Add other fields to match your RFQItem model
];

const rowsCount = rfqItemFields.length + 1;
const rowsClass = `repeat(${rowsCount}, 1fr)`;
