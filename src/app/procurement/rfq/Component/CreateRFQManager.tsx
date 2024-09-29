"use client";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { DateTimePicker } from "@/Components/ui/datetime";
import { DialogFooter } from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import OpenedBy from "@/Components/widget/OpenedBy";
import RequisitionSelect from "@/Components/widget/RequisitionSelect";
import SubmitButton from "@/Components/widget/SubmitButton";
import SupplierSelect from "@/Components/widget/VendorsSelect";
import { transformFormDataWithItems } from "@/lib/helpers";
import { generateHex } from "@/lib/utils/generators";
import { Label } from "@radix-ui/react-label";
import { createRFQ, updateRFQ } from "../actions";
import RFQItem from "./CreateRFQItem";
import { Input } from "@/Components/ui/input";
import ActionButton from "@/Components/ActionButton";

type Item = {
  id: string;
  isNew?: boolean;
};

type Props = {
  user: AuthUser;
  isOpen: boolean;
  rfq?: RFQ;
  closeDialog: () => void;
};

function init(length = 2): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: generateHex(),
      isNew: true,
    });
  }
  return items;
}

export default function AddRFQItemsContainer(props: Props) {
  const { user, isOpen, rfq, closeDialog } = props;
  const [selectedRequisition, setSelectedRequisition] = useState<
    Requisition | undefined
  >();

  const [items, setItems] = useState(
    init((rfq || selectedRequisition)?.items.length)
  );

  useEffect(() => {
    if (selectedRequisition) setItems(init(selectedRequisition.items.length));
  }, [selectedRequisition]);

  function addItem() {
    setItems((prev) => {
      prev = prev.reduce((_items, current) => {
        current.isNew = false;
        _items.push(current);
        return _items;
      }, [] as Item[]);
      return [
        ...prev,
        {
          id: generateHex(),
          isNew: true,
        },
      ];
    });
  }

  function removeItem(id: string) {
    if (items.length == 1) {
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function submitForm(formData: FormData) {
    if (formRef.current && !formRef.current.checkValidity()){

      formRef.current.reportValidity();
      return;
    }

    const json = transformFormDataWithItems(formData);

    const meta = {
      year:
        new URLSearchParams("?" + location.href.split("?")[1]).get("year") ??
        null,
    };
    json.meta = meta;
    const response = await (props.rfq ? updateRFQ : createRFQ)(
      json,
      location.pathname
    );

    if (response.success) {
      toast.success(response.message);
      closeDialog();
      return;
    }
    toast.error(response.message);
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={submitForm} className="grid gap-2 pt-4 w-full">
      <input type="hidden" name="rfq_id" defaultValue={rfq?.id} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1 pb-2 w-full min-[645px]">
        <div className="grid gap-1 col-span-1">
          <Label htmlFor="rfq" className="font-semibold">
            Requisition{" "}
            <span
              title={`Rfq field is required`}
              className="pt-2 text-primary font-bold"
            >
              *
            </span>
          </Label>

          <RequisitionSelect
            open={isOpen}
            fetchRequisition={
              !rfq
                ? {
                    cb: (data?: Requisition) => {
                      if (data) {
                        setSelectedRequisition(data);
                        return;
                      }
                      setSelectedRequisition(undefined);
                    },
                  }
                : undefined
            }
            defaultValue={rfq?.requisition}
          />
        </div>

        <div className="grid col-span-1 sm:col-span-2 gap-1 min-w-max">
          <Label htmlFor="rfq" className="font-semibold">
            Suppliers{" "}
            <span
              title={`Rfq field is required`}
              className="pt-2 text-primary font-bold"
            >
              *
            </span>
          </Label>

          <SupplierSelect open={isOpen} isMulti defaultValue={rfq?.suppliers} />
        </div>

        <div className="grid gap-1 col-span-1">
          <Label htmlFor="rfq" className="font-semibold">
            Officer{" "}
            <span
              title={`Rfq field is required`}
              className="pt-2 text-primary font-bold"
            >
              *
            </span>
          </Label>
          <p className="p-1 md:p-2 text-xs md:text-sm border rounded-md">
            {rfq?.officer.name || user.name}
          </p>
        </div>
      </div>
      <div
        data-wrapper
        className="items max-h-[37dvh] h-full pr-4 overflow-auto"
      >
        <Label className="font-semibold pb-2">RFQ Items</Label>

        <div className="grid grid-cols-1">
          {items.map((item, idx) => (
            <div className="row" key={item.id}>
              <RFQItem
                idx={idx}
                defaultValue={!!selectedRequisition}
                data={
                  (rfq || selectedRequisition) &&
                  (rfq || selectedRequisition)?.items[idx]
                }
                isLast={item.isNew}
                remove={() => removeItem(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="ot-4 w-full">
        <div className=" w-full">
          <div className="flex items-center justify-between w-full gap-4">
            <Button
              type="button"
              title={"Add RFQ Item"}
              className="w-8 h-8 p-1 self-start rounded-full bg-secondary hover:bg-secondary text-secondary-foreground border shadow"
              onClick={addItem}
            >
              <Plus />
            </Button>

            <div className="grid grid-cols-[auto,auto] gap-x-6">
              <div className="grid sm:grid-cols-[auto,auto] items-center w-max gap-4">
                <label
                  htmlFor={"auto_publish"}
                  className="text-sm font-semibold inline-block"
                >
                  Auto Publish:
                </label>
                <Switch
                  defaultChecked={rfq?.auto_publish}
                  id="auto_publish"
                  name="auto_publish"
                />
              </div>
              <div className="grid sm:grid-cols-[auto,auto] items-center w-max gap-4">
                <label
                  htmlFor="required_date"
                  className="text-sm font-semibold inline-block"
                >
                  Date Required:
                </label>
                <Input
                  minDate={new Date()}
                  id="required_date"
                  type="date"
                  name="required_date"
                  required
                  defaultValue={rfq?.deadline.split("T")[0]}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-8">
            <div className="">
              <Label htmlFor="description" className="font-semibold">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                defaultValue={rfq?.description}
                placeholder="add remarks about this requisition..."
              ></Textarea>
            </div>
            <div className="">
              <Label htmlFor="conditions" className="font-semibold">
                Terms and Conditions
              </Label>

              <Textarea
                id="conditions"
                name="conditions"
                defaultValue={rfq?.terms_and_conditions}
                placeholder="add terms and conditions..."
              ></Textarea>
            </div>
          </div>
          <div className="pb-8">
            <div className="block w-full max-w-[400px] mx-auto">
              <ActionButton
                text={rfq ? "Update RFQ" : "+ Create RFQ"}
                btnProps={{ className: "w-full text-lg", size: "lg" }}
              />
            </div>
          </div>

          <div className="grid gap-4 w-full pt-2">
            <OpenedBy isOpen rfq_id={rfq?.id} />
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}
