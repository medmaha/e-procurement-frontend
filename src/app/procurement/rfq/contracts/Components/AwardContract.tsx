import React, { ReactNode } from "react";
import { formatNumberAsCurrency } from "@/lib/helpers";
import Link from "next/link";
import { format, formatDistance, formatDistanceToNow } from "date-fns";
import ActionButton from "@/Components/ActionButton";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Button } from "@/Components/ui/button";
import ApproveContract from "./ApproveContract";
import { generate_unique_id } from "@/lib/helpers/generator";
import ClientSitePage from "@/Components/ui/ClientSitePage";

type Props = {
  user: AuthUser;
  permissions: AuthPerm;
  children: ReactNode;
  contract?: {
    id: string;
    status: string;
    officer: {
      id: ID;
      name: string;
    };
    approvable: boolean;
    terms_and_conditions: string;
  };
  quotation: RFQResponse;
  submitContract: any;
};

export default function AwardContract(props: Props) {
  const { user, quotation, permissions, submitContract } = props;

  return (
    <>
      <div>
        <ClientSitePage
          page={{
            title: "RFQ Contract",
            description: "Award a contract to a supplier",
          }}
        />
        <div className="section-content">
          <div className="flex justify-between w-full items-center gap-4 flex-wrap">
            <div className="">
              <p className="text-muted-foreground max-w-[60ch] pt-1 text-sm leading-relaxed">
                {!props.contract ? (
                  <>
                    This contract will be based on the following objects{" "}
                    <Link
                      className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
                      href={"/procurement/rfq/" + quotation.rfq.id}
                    >
                      <b>({generate_unique_id("RFQ", quotation.rfq.id)})</b>
                    </Link>
                    {" and "}
                    <Link
                      className="inline hover:underline transition underline-offset-4 hover:text-sky-500 whitespace-nowrap"
                      href={"/procurement/rfq/responses/" + quotation.unique_id}
                    >
                      <b>
                        (Quotation {generate_unique_id("QR", quotation.id)})
                      </b>
                    </Link>{" "}
                    which was submitted by{" "}
                    <Link
                      className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
                      href={"/suppliers/" + quotation.vendor.id}
                    >
                      <b>{quotation.vendor.name}</b>
                    </Link>
                  </>
                ) : (
                  <>This quotation has already been contracted</>
                )}
              </p>
            </div>

            {props.contract && !props.contract.approvable && (
              <ApproveContract
                supplier={quotation.vendor as any}
                contract={props.contract}
              />
            )}
          </div>
        </div>
        <div className="overflow-hidden border shadow-md mb-4 rounded-md">
          <h2 className="font-semibold p-2 text-lg border-b text-center bg-accent/50 text-accent-foreground">
            Quotation Details
          </h2>
          <div className="px-2 sm:px-4 pb-4">
            <div className="mt-4 pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-y-6 text-sm">
              <div className="grid">
                <p className="font-semibold">Pricing GMD</p>
                <p className="">
                  D{formatNumberAsCurrency(Number(quotation.pricing))}
                </p>
              </div>
              <div className="grid">
                <p className="font-semibold">Quotation Validity Period</p>
                <p className="">
                  {formatDistance(
                    new Date(quotation.validity_period),
                    new Date(),
                    { addSuffix: true }
                  )}
                </p>
              </div>
              <div className="grid">
                <p className="font-semibold">Delivery Date</p>
                <p className="">
                  {format(new Date(quotation.delivery_date), "PPpp")}
                </p>
              </div>
              <div className="grid">
                <p className="font-semibold">Payment Method</p>
                <p className="">{quotation.payment_method}</p>
              </div>
              <div className="grid">
                <p className="font-semibold">RFQ ID</p>
                <p className="">
                  <Link
                    href={"/procurement/rfq/" + quotation.rfq.id}
                    className="hover:underline transition underline-offset-4 hover:text-sky-500"
                  >
                    {generate_unique_id("RFQ", quotation.rfq.id)}
                  </Link>
                </p>
              </div>
              <div className="">
                <p className="font-semibold">Quotation Submission Date</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {format(new Date(quotation.created_date), "PPPPp")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form action={submitContract}>
          <div className="overflow-hidden border shadow-md rounded-md">
            <input type="hidden" name="quotation_id" value={quotation.id} />
            <input type="hidden" name="rfq_id" value={quotation.rfq.id} />
            <h2 className="font-semibold p-2 text-lg border-b text-center bg-accent/50 text-accent-foreground">
              Contract Details
            </h2>
            <div className="px-2 sm:px-4 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2">
                <div className="grid gap-1">
                  <Label
                    htmlFor="terms_and_conditions"
                    className="font-semibold"
                  >
                    Officer
                  </Label>
                  <p className="p-2 rounded-sm border bg-accent/30 text-sm">
                    {user.name}
                  </p>
                </div>
                <div className="grid gap-1">
                  <Label
                    htmlFor="terms_and_conditions"
                    className="font-semibold"
                  >
                    Vendor
                  </Label>
                  <p className="p-2 rounded-sm border bg-accent/30 text-sm">
                    {quotation.vendor.name}
                  </p>
                </div>
                <div className="grid gap-1">
                  <Label
                    htmlFor="terms_and_conditions"
                    className="font-semibold"
                  >
                    Quotation
                  </Label>
                  <p className="p-2 rounded-sm border bg-accent/30 text-sm">
                    Q-{quotation.unique_id}
                  </p>
                </div>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="terms_and_conditions" className="font-semibold">
                  Terms and Conditions
                </Label>
                {props.contract ? (
                  <p className="p-2 rounded-sm border text-sm min-h-[100px]">
                    {props.contract.terms_and_conditions}
                  </p>
                ) : (
                  <Textarea
                    required
                    autoFocus
                    minLength={50}
                    maxLength={1000}
                    placeholder="write your terms and conditions here..."
                    id="terms_and_conditions"
                    name="terms_and_conditions"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-4 lg:gap-6 flex-wrap text-xs">
                <div className="">
                  {!props.contract && (
                    <p className="text-muted-foreground max-w-[65ch]">
                      By submitting this form you agree to the terms and
                      conditions mentioned in{" "}
                      <a
                        className="hover:underline hover:text-sky-500 font-semibold underline-offset-4 transition"
                        href="#"
                      >
                        Privacy | Terms and Conditions
                      </a>
                      <>
                        <br />
                        <Label htmlFor="term">
                          <input
                            required
                            id="term"
                            type="checkbox"
                            className="mt-2 mr-2 translate-y-0.5"
                          />
                          I agree to the privacy and terms
                        </Label>
                      </>
                    </p>
                  )}
                </div>

                {props.contract ? (
                  <Badge className="ml-4" variant={"success"}>
                    Contracted
                  </Badge>
                ) : (
                  <ActionButton
                    text="Award Contract"
                    btnProps={{
                      className: "md:text-base xl:text-lg max-w-[300px] w-full",
                      type: "submit",
                      size: "default",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
