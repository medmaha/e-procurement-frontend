"use client";
import { format } from "date-fns";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "react-toastify";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import { Label } from "@radix-ui/react-label";
import { submitRFQResponse } from "../actions";
import RFQResponseBrochures from "./BrochuresCreate";
import DeliveryTermsSelect from "@/Components/widget/DeliveryTermsSelect";
import PaymentMethodSelect from "@/Components/widget/PaymentMethodSelect";
import { DateTimePicker } from "@/Components/ui/datetime";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  user: AuthUser;
  data: RFQRequest;
  autoFocus: boolean;
  onClose?: any;
};

export default function AcceptRFQRequest(props: Props) {
  const [isOpen, setOpen] = useState(props.autoFocus);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setOpen(opened);
        if (!opened) props.onClose?.();
      }}
    >
      <DialogContent className="2xl:max-w-[1300px] max-w-[95%] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border-4 shadow-xl">
        <DialogHeader>
          <DialogTitle>
            Quotation Response to
            <span className="ml-1 text-muted-foreground">
              ({generate_unique_id("RFQ", props.data.id)})
            </span>
          </DialogTitle>
          <DialogDescription>
            On behalf of your organization <b>{props.user.meta.vendor?.name}</b>
            , please respond to the RFQ sent by{" "}
            <b>{props.data.officer?.name}</b>.{" on "}
            {format(new Date(props.data.created_date), "PPP")}
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <RFQResponseContent
            data={props.data}
            isOpen={isOpen}
            user={props.user}
            closeDialog={() => {
              setOpen(false);
              props.onClose?.();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type Props2 = {
  user: AuthUser;
  isOpen: boolean;
  data: RFQRequest;
  closeDialog: () => void;
};

function RFQResponseContent(props: Props2) {
  const { closeDialog } = props;
  async function submitForm(formData: FormData) {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    const response = await submitRFQResponse(formData, location.pathname);
    if (response.success) {
      toast.success(response.message);
      return closeDialog();
    }
    toast.error(response.message);
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={submitForm}
      className="grid gap-2"
      onInput={() => {
        const form = formRef.current;
        const classes = ["opacity-50", "pointer-events-none"];
        let action = "add";

        if (form?.checkValidity()) action = "remove";

        formRef.current
          ?.querySelector("[data-submit]")
          ?.classList[action as "add" | "remove"](...classes);
      }}
    >
      <input type="hidden" name="rfq_id" defaultValue={props.data.id} />

      <div className="grid grid-cols-2 lg:grid-cols-[65%,auto] gap-4 pt-4">
        <div className="space-y-2 sm:space-y-4">
          <div className="grid sm:grid-cols-2 sm:gap-2 gap-4 md:gap-4">
            {/* Proforma */}
            <div className="">
              <Label
                className="pb-1 inline-flex text-sm items-center gap-4 "
                htmlFor="proforma"
              >
                <span>
                  Proforma
                  <span className="text-red-500 pl-1.5">*</span>
                </span>
              </Label>
              <Input
                type="file"
                id="proforma"
                name="proforma"
                required
                accept={[
                  ".pdf",
                  ".xlsx",
                  ".html",
                  ".htm",
                  ".png",
                  ".jpeg",
                ].join(",")}
                className="cursor-pointer"
              />
            </div>
            {/* Form 101 */}
            <div className="">
              <Label
                className="pb-1 gap-2 text-sm inline-flex items-center "
                htmlFor="form101"
              >
                <span>Form-101</span>
                <span className="text-muted-foreground text-xs">
                  (Optional)
                </span>
              </Label>
              <Input
                type="file"
                id="form101"
                name="form101"
                accept={[
                  ".pdf",
                  ".xlsx",
                  ".html",
                  ".htm",
                  ".png",
                  ".jpeg",
                ].join(",")}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-2 gap-4 md:gap-4">
            {/* Pricing */}
            <div className="">
              <Label
                className="pb-1 inline-flex text-sm items-center gap-4 "
                htmlFor="pricing"
              >
                <span>
                  Pricing (GMD)
                  <span className="text-red-500 pl-1.5">*</span>
                </span>
              </Label>
              <Input
                type="number"
                id="pricing"
                name="pricing"
                required
                placeholder="Total Amount"
                className="cursor-pointer"
              />
            </div>
            {/* Validity Period */}
            <div className="">
              <Label
                className="pb-1 inline-flex text-sm items-center gap-4 "
                htmlFor="validity_period"
              >
                <span>
                  Validity Period
                  <span className="text-red-500 pl-1.5">*</span>
                </span>
              </Label>

              <DateTimePicker
                name="validity_period"
                className="text-sm placeholder:text-sm"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-2 gap-4 md:gap-4">
            {/* Delivery Terms */}
            <div className="">
              <Label
                className="pb-1 inline-flex text-sm items-center gap-4 "
                htmlFor="delivery_terms"
              >
                <span>
                  Delivery Date
                  <span className="text-red-500 pl-1.5">*</span>
                </span>
              </Label>
              <DateTimePicker
                name="delivery_date"
                className="text-sm placeholder:text-sm"
              />
            </div>
            {/* Validity Period */}
            <div className="">
              <Label
                className="pb-1 inline-flex text-sm items-center gap-4 "
                htmlFor="payment_method"
              >
                <span>
                  Payment Method
                  <span className="text-red-500 pl-1.5">*</span>
                </span>
              </Label>
              <PaymentMethodSelect />
            </div>
          </div>

          <div className="">
            <Label className="pb-1 text-sm" htmlFor="remarks">
              Terms And Conditions
            </Label>
            <Textarea
              id="remarks"
              name="remarks"
              className="text-sm placeholder:text-sm"
              placeholder="Include your terms and conditions (optional)"
            ></Textarea>
          </div>
        </div>

        <div className="space-y-2">
          {/* <div className="">
						<Label className="pb-1 ">Authorized By</Label>
						<p className="p-2 rounded-md border">
							You{" "}
							<span className="text-muted-foreground">@{props.user.name}</span>
						</p>
					</div> */}
          <div>
            <Label className="pb-1 text-sm">Brochures/Attachments</Label>
            <RFQResponseBrochures />
          </div>
        </div>
      </div>

      <div className="pt-4 w-full grid sm:grid-cols-3 gap-4">
        <DialogClose asChild>
          <Button type="button" variant={"outline"}>
            Cancel
          </Button>
        </DialogClose>
        <SubmitButton
          data-submit
          text="Submit Quotation"
          className="w-full block opacity-50 pointer-events-none"
        />
      </div>
    </form>
  );
}

function TodaysDate() {
  const date = useRef(new Date());
  const element = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      date.current = new Date();
      if (element.current) {
        element.current.textContent = format(date.current, "PPPppp");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span ref={element} className="text-xs">
      {format(date.current, "PPPppp")}
    </span>
  );
}
