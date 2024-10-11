"use client";
import { Loader2, Plus, TrendingUpIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { transformFormDataWithItems } from "@/lib/helpers";
import { generateHex } from "@/lib/utils/generators";
import { createRequisition } from "../../actions";
import RequisitionCreateItem from "./RequisitionCreateItem";
import SubmitButton from "@/Components/widget/SubmitButton";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  user: AuthUser;
  requisition?: RequisitionRetrieve;
  closeDialog?: () => void;
  loading?: boolean;
  redirectToView?: boolean;
};

function getInitialItems(requisition?: RequisitionRetrieve) {
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

export default function RequisitionCreateWrapper({ user, ...props }: Props) {
  const { requisition, closeDialog, redirectToView } = props;
  const [items, setItems] = useState(getInitialItems(props.requisition));
  const [totalCosts, setTotalCosts] = useState<{ [idx: number]: number }>({});

  const totalSum = useMemo(() => {
    return Object.values(totalCosts).reduce((acc, cur) => (acc += cur), 0);
  }, [totalCosts]);

  const [invalidForm, setInvalidForm] = useState(true);

  const queryClient = useQueryClient();

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
    const response = await createRequisition(data, !!requisition);
    if (!response.success) {
      toast.error(response.message, {});
      return;
    }
    formRef.current?.reset();
    toast.success(
      response.message ||
        `Requisition ${requisition ? "updated" : "created"} successfully`
    );

    if (requisition)
      await queryClient.invalidateQueries({
        queryKey: ["requisition", requisition.id],
      });

    queryClient.invalidateQueries({
      queryKey: ["requisitions"],
      exact: false,
    });

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
          <div className="relative block w-full">
            <div className="table-wrapper max-h-[38dvh] !border-0 relative">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="">
                      <small>#</small>
                    </th>
                    <th className="">Item Description</th>
                    <th className="">Qty</th>
                    <th className="">M-Unit</th>
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
                        remove={() => {
                          removeItem(idx);
                          setTotalCosts((prev) => {
                            try {
                              delete prev[idx];
                            } catch (error) {}
                            return { ...prev };
                          });
                        }}
                        updateTotalCost={(total) => {
                          setTotalCosts((prev) => ({
                            ...prev,
                            [idx]: total,
                          }));
                        }}
                      />
                    );
                  })}
                </tbody>
              </table>
              {props.loading && (
                <div className="absolute bottom-0 backdrop-blur-[2px] z-10 left-0 w-full h-[70%] flex justify-center items-center">
                  <Loader2 className="w-10 h-10 dark:text-primary/50 text-primary animate-spin md:stroke-[3px]" />
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 z-10">
              <Button
                type="button"
                title={"Add Item"}
                className="w-10 h-10 p-1 rounded-full shadow"
                variant={"secondary"}
                onClick={addItem}
                disabled={props.loading}
              >
                <Plus />
              </Button>
            </div>
          </div>

          <div className="py-4 pt-8 flex sm:flex-nowrap items-center justify-between mt-4 gap-6 flex-wrap">
            <div className="flex-1 order-last max-w-[350px] gap-1.5 grid grid-cols-1 font-semibold">
              <SubmitButton
                disabled={invalidForm}
                className="font-semibold transition duration-300"
                text={`${requisition ? "Update" : "Create"} Requisition`}
              />
            </div>
            <div className="flex items-center gap-2 min-w-[100px] md:pl-6">
              <p className="font-semibold text-sm">Subtotal:</p>
              <p className="text-sm">
                {totalSum > 0
                  ? new Intl.NumberFormat("en-US", {
                      currency: "GMD",
                      style: "currency",
                    }).format(Number(totalSum))
                  : "GMD 0.00"}
              </p>
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
                  <p className="rounded-md min-w-[220px]">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
