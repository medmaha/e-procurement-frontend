"use client";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface Brochure {
  id: ID;
  name: string;
  file: string;
  autoFocus?: boolean;
}

type Props = {
  brochures?: Brochure[];
};

const newBrochure = (): Brochure => ({ id: String(Math.random()) } as any);

export default function RFQResponseBrochures(props: Props) {
  const [items, setItems] = useState<Brochure[]>(
    props.brochures?.length ? props.brochures : []
  );

  const addBrochure = () => {
    setItems((prev) => [...prev, { ...newBrochure(), autoFocus: true }]);
  };
  const removeBrochure = (pk: ID) => {
    // if (items.length === 1) return;
    setItems((prev) => prev.filter((b) => b.id !== pk));
  };

  return (
    <div className="border p-2 mt-1">
      {items.length >= 1 && (
        <div
          className={`overflow-hidden overflow-y-auto max-h-[45svh] pr-2 ${
            props.brochures ? "grid md:grid-cols-2 gap-2" : ""
          }`}
        >
          {items.map((item, index) => {
            return (
              <BrochureItem
                index={index}
                key={item.name + "-" + index}
                brochure={item}
                removeBrochure={() => removeBrochure(item.id)}
              />
            );
          })}
        </div>
      )}
      <div className="p-2">
        <Button type="button" onClick={addBrochure} size="sm">
          Add Brochure
        </Button>
      </div>
    </div>
  );
}

type PropsItem = {
  index: number;
  brochure: Brochure;
  removeBrochure: () => void;
};

function BrochureItem(props: PropsItem) {
  return (
    <div
      className={`grid grid-cols-[auto,1fr,1fr,auto] gap-2 items-center pb-1`}
    >
      <div className="mt-5">
        <p>
          <small>{props.index + 1}.</small>
        </p>
      </div>
      <div className="grid gap-1 mt-1">
        <Label htmlFor="name" className="text-xs">
          Name:
        </Label>
        <Input
          name={`${props.index + 1}-brochure-name`}
          id="name"
          required={true}
          className="p-1 h-max placeholder:text-xs"
          placeholder="Brochure name"
          autoFocus={props.brochure.autoFocus}
          defaultValue={props.brochure.name}
        />
      </div>
      <div className="grid gap-1 mt-1">
        <Label
          htmlFor="file"
          className="inline-flex items-center gap-2 text-xs"
        >
          <span>File:</span>
          {props.brochure?.file && (
            <a
              href=""
              className="inline-flex file:placeholder py-1 px-2 text-xs text-muted-foreground bg-muted transition truncate hover:bg-secondary hover:text-secondary-foreground"
            >
              {props.brochure.file}
            </a>
          )}
        </Label>
        <Input
          id={`file-${props.index}`}
          type="file"
          className="p-1 h-[30px] leading-none file:text-xs placeholder:text-xs text-xs inline-flex items-center"
          name={`${props.index + 1}-brochure-file`}
          required={true}
          accept={[".pdf", ".xlsx", ".html", ".htm", ".png", ".jpeg"].join(",")}
        />
      </div>
      <div className="mt-7">
        <Button
          variant="destructive"
          onClick={props.removeBrochure}
          className="h-7 w-7"
          size="icon"
          type="button"
        >
          <XCircle width={18} />
        </Button>
      </div>
    </div>
  );
}
