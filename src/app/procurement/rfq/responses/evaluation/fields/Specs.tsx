import { Checkbox } from "@/Components/ui/checkbox";

type Props = {
  disabled: boolean;
  isRejected: boolean;
  defaultValue?: boolean;
  updateData: (value: boolean) => void;
};

export default function Specs(props: Props) {
  return (
    <p className="inline-flex items-center gap-2 text-sm ">
      <span className={props.isRejected ? "text-destructive" : ""}>
        Meets Requirements:
      </span>
      <Checkbox
        disabled={props.disabled}
        defaultChecked={props.defaultValue}
        className={`w-[24px] h-[24px] ${
          props.isRejected ? "cursor-not-allowed border-destructive" : ""
        }`}
        onCheckedChange={(checked) =>
          props.updateData(Boolean(checked.valueOf()))
        }
      />
    </p>
  );
}
