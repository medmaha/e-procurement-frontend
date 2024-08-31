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

export default function PaymentMethodSelect({ defaultValue, ...props }: any) {
  const PAYMENT_CHOICES = [
    "Cash On Delivery",
    "Cash before Delivery",
    "Check on Delivery",
    "Check before Delivery",
    "Credit Card on Delivery",
    "Credit Card before Delivery",
  ];
  return (
    <Select
      key={defaultValue}
      name="payment_method"
      disabled={props.disabled}
      required={props.required}
      defaultValue={defaultValue}
    >
      <SelectTrigger id="payment_method">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent id="payment_method">
        <SelectGroup>
          <SelectLabel>Choose from the list</SelectLabel>
          {PAYMENT_CHOICES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
