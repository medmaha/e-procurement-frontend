import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/ui/utils";

type Props = {
  name?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function MeasurementUnitSelection(props: Props) {
  const { disabled, required, value, name } = props;
  return (
    <Select
      key={props.value}
      defaultValue={props.value?.toLowerCase()}
      disabled={disabled}
      required={required}
      name={name}
    >
      <SelectTrigger
        className={cn(
          "uppercase",
          props.triggerClassName,
          props.readOnly && "disabled:pointer-events-none disabled:text-current"
        )}
        // "bg-background text-sm p-0 px-1 h-[30px] rounded-none disabled:pointer-events-none"
        disabled={disabled}
      >
        <SelectValue
          placeholder="-------"
          className={cn(
            "",
            props.readOnly &&
              "disabled:pointer-events-none disabled:text-current"
          )}
        />
      </SelectTrigger>
      <SelectContent className={cn("", props.contentClassName)}>
        <SelectGroup className="">
          <SelectLabel className="">Unit Of Measurements</SelectLabel>
          {(props.readOnly ? [value || UNITS_TYPES[0]] : UNITS_TYPES).map(
            (type) => {
              return (
                <SelectItem
                  key={type}
                  value={type.toLowerCase()}
                  className="capitalize"
                >
                  {type}
                </SelectItem>
              );
            }
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const UNITS_TYPES = [
  "units",
  "pieces",
  "bundles",
  "bytes",
  "litres",
  "metres",
  "inches",
  "ounces",
  "pounds",
  "feet",
  "yards",
  "miles",
];
