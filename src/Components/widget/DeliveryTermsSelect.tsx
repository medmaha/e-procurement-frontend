"use client";
"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function DeliveryTermsSelect({ defaultValue, ...props }: any) {
  const DELIVERY_TERMS_CHOICES = [
    "Net 7 Days",
    "Net 15 Weeks",
    "Net 30 Days",
    "Net 60 Days",
    "Net 90 Days",
  ];
  return (
    <Select
      key={defaultValue}
      name="delivery_terms"
      required={props.required}
      disabled={props.disabled}
      defaultValue={defaultValue}
    >
      <SelectTrigger id="delivery_terms">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent id="delivery_terms">
        <SelectGroup>
          <SelectLabel>Choose from the list</SelectLabel>
          {DELIVERY_TERMS_CHOICES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
