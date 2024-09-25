"use client";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  formatNumberAsCurrency,
  transformFormDataWithItems,
} from "@/lib/helpers";
import { generateHex } from "@/lib/utils/generators";
import { createRequisition } from "../../actions";
import RequisitionCreateItem from "./RequisitionCreateItem";

type Props = {
  user: AuthUser;
  requisition?: Requisition;
  closeDialog?: () => void;
  redirectToView?: boolean;
};

function getInitialItems(requisition?: Requisition) {
  if (!requisition) {
    return [generateHex(8), generateHex(8)];
  }
  const items = [];
  for (let i = 0; i < requisition.items.length; i++) {
    items.push(generateHex(8));
  }
  if (items.length < 1) {
    items.push(generateHex(8));
  }
  if (items.length < 2) {
    items.push(generateHex(8));
  }
  return items;
}

export default function RequisitionCreateWrapper(props: Props) {
  const { user, requisition, closeDialog, redirectToView } = props;
  const [items, setItems] = useState(getInitialItems(props.requisition));
  const [totalSum, setTotalSum] = useState("");
  const [invalidForm, setInvalidForm] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(revalidateInvalidity, 250);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // const _items= [...items];
    revalidateInvalidity();
    const formElement = formRef.current;
    formElement?.querySelector(".overflow-y-auto")?.scrollTo({
      behavior: "smooth",
      top: 500,
    });
  }, [items]);

  function addItem() {
    setItems([...items, generateHex(8)]);
  }

  function removeItem(idx: number) {
    if (items.length == 1) {
      toast.warn("At least one item is required", {
        position: "bottom-center",
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        closeButton: false,
        hideProgressBar: true,
      });
      return;
    }
    setItems((prev) => {
      const iter = prev.filter((_, index) => {
        return index !== idx;
      });
      if (!iter.length) return [generateHex()];
      return iter;
    });
    updateTotalSum();
  }

  function revalidateInvalidity() {
    if (formRef.current?.checkValidity()) {
      setInvalidForm(false);
    } else {
      setInvalidForm(true);
    }
  }

  function updateTotalSum() {
    revalidateInvalidity();

    const json = Object.fromEntries(
      new FormData(formRef.current || undefined).entries()
    );
    let total = "";
    for (const [key, value] of Object.entries(json)) {
      if (key.match(/total_price/gi)) {
        if (value.valueOf()) {
          const val = String(value);
          if (val.match(/[a-zA-z]/gi)) continue;
          total = (Number(total) + Number(val)).toString();
        }
      }
    }
    setTotalSum(total);
  }

  const formRef = useRef<HTMLFormElement>(null);

  async function submitForm(formData: FormData) {
    if (formRef.current?.checkValidity() !== true) {
      formRef.current?.reportValidity();
      return;
    }
    const json = transformFormDataWithItems(formData);
    const data = {
      meta: {
        id: requisition?.id,
      },
      ...json,
    };
    if (!requisition) delete data.meta.id;
    const response = await createRequisition(
      data,
      location.pathname,
      !!requisition
    );
    if (!response.success) {
      toast.error(response.message, {});
      return;
    }
    formRef.current?.reset();
    toast.success(
      response.message ||
        `Requisition ${requisition ? "updated" : "created"} successfully`
    );

    if (closeDialog) {
      return closeDialog();
    }
    if (redirectToView) {
      return redirect("/procurement/requisitions");
    }
  }

  return (
    <>
      <form
        ref={formRef}
        className="block"
        action={submitForm}
        onInput={updateTotalSum}
      >
        <div className="w-full pt-6">
          <div className="table-wrapper max-h-[38dvh] !border-0">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className=""></th>
                  <th className="">Item Description</th>
                  <th className="">M-Unit</th>
                  <th className="">Qty</th>
                  <th className="">Unit Price</th>
                  <th className="">Total Cost</th>
                  <th className="">Remarks</th>
                  <th className="">
                    <span className="text-xs">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  return (
                    <RequisitionCreateItem
                      key={item}
                      idx={idx}
                      data={requisition && requisition.items[idx]}
                      remove={removeItem}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="py-4 pt-8 flex items-center justify-between gap-6 flex-wrap">
            <div className="">
              <Button
                type="button"
                title={"Add Item"}
                className="w-8 h-8 p-1 rounded-full bg-secondary hover:bg-secondary text-secondary-foreground border shadow"
                onClick={addItem}
              >
                <Plus />
              </Button>
            </div>
            <div className="flex-1 max-w-[300px] gap-1.5 grid grid-cols-1 font-semibold">
              <Button
                disabled={invalidForm}
                className="font-semibold transition duration-300"
              >
                {requisition ? "Update" : "Create"} Requisition
              </Button>
            </div>
            <div className="flex items-center gap-2 min-w-[100px]">
              {totalSum && (
                <>
                  <p className="font-semibold text-sm">Subtotal:</p>
                  <p className="text-sm">
                    {new Intl.NumberFormat("en-US", {
                      currency: "GMD",
                      style: "currency",
                    }).format(Number(totalSum))}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 grid gap-x-4 gap-y-4 md:grid-cols-[auto,1fr]">
          <div className="">
            <h5 className="font-semibold">Summary</h5>
            <p className="text-xs opacity-70 leading-relaxed max-w-[60ch] md:max-w-[50ch]">
              Requisition: Formal request for products/services, marking the
              start of procurement, outlining needs.
            </p>
          </div>
          <div className="grid md:grid-cols-[1fr,auto] gap-6">
            <div className="max-w-[600px] flex-1 block">
              <Label className="space-y-1">
                <span>Remarks</span>

                <Textarea
                  placeholder="Add a remark..."
                  name="remarks"
                  className="w-full min-h-[80px] resize-none"
                />
              </Label>
            </div>
            <div className="grid gap-2">
              {/* <div className="grid gap-1">
								<p className="">Officer</p>
								<p className="p-1 border rounded-md">{user.name}</p>
							</div> */}
              <div className="h-full">
                <div className="grid gap-1">
                  <p className="text-muted-foreground text-sm">Authored By:</p>
                  <p className="rounded-md min-w-[220px]">{props.user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
