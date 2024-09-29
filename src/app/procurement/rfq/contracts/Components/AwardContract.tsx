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
      <div className="section-heading !mb-4">
        {props.children}
        <div className="">
          <h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
            {!props.contract ? "Create Contract" : "Contract Award"} for{" "}
            <Link
              className="inline text-muted-foreground hover:underline transition underline-offset-[6px] hover:text-sky-500"
              href={"/procurement/rfq/responses/" + quotation.unique_id}
            >
              <b>(Quotation Q-{quotation.unique_id})</b>
            </Link>{" "}
          </h1>
        </div>
      </div>

      <div>
        <div className="section-content">
          <div className="flex justify-between w-full items-center gap-4 flex-wrap">
            <div className="">
              <div className="">
                <h2 className="font-semibold sm:text-lg">
                  {props.contract ? (
                    <Badge className="" variant={"success"}>
                      Contracted
                    </Badge>
                  ) : (
                    "Contract Award"
                  )}
                </h2>
                <p className="text-muted-foreground max-w-[60ch] pt-1 text-sm leading-relaxed">
                  {!props.contract ? (
                    <>
                      This contract will be based on the following objects{" "}
                      <Link
                        className="inline hover:underline transition underline-offset-4 hover:text-sky-500"
                        href={"/procurement/rfq/" + quotation.rfq.unique_id}
                      >
                        <b>({quotation.rfq.unique_id})</b>
                      </Link>{" "}
                      and{" "}
                      <Link
                        className="inline hover:underline transition underline-offset-4 hover:text-sky-500 whitespace-nowrap"
                        href={
                          "/procurement/rfq/responses/" + quotation.unique_id
                        }
                      >
                        <b>(Quotation Q-{quotation.unique_id})</b>{" "}
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
            </div>

            {props.contract && !props.contract.approvable && (
              <ApproveContract
                supplier={quotation.vendor as any}
                contract={props.contract}
              />
            )}
          </div>
        </div>
        <div className="section-content !p-0 overflow-hidden">
          <h2 className="font-semibold p-2 text-lg border-b text-center bg-accent text-accent-foreground">
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
                <p className="font-semibold">Delivery Period</p>
                <p className="">{quotation.delivery_terms}</p>
              </div>
              <div className="grid">
                <p className="font-semibold">Payment Method</p>
                <p className="">{quotation.payment_method}</p>
              </div>
              <div className="grid">
                <p className="font-semibold">RFQ ID</p>
                <p className="">
                  <Link
                    href={"/procurement/rfq/" + quotation.rfq.unique_id}
                    className="hover:underline transition underline-offset-4 hover:text-sky-500"
                  >
                    {quotation.rfq.unique_id}
                  </Link>
                </p>
              </div>
              <div className="grid">
                <p className="font-semibold">RFQ Deadline Date</p>
                <p className="">
                  {formatDistanceToNow(new Date(quotation.deadline), {
                    includeSeconds: true,
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="grid">
                <p className="font-semibold">RFQ Created Date</p>
                <p className="">
                  {format(new Date(quotation.created_date), "PPPpp")}
                </p>
              </div>
              {/* <div className="grid">
									<p className="font-semibold">RFQ Status</p>
									<p className="">
										{quotation.rfq.open_status ? (
											<span className="text-green-500">OPEN</span>
										) : (
											<span className="text-destructive dark:text-red-400">
												CLOSED
											</span>
										)}
									</p>
								</div> */}
              <div className="pt-2 border-t col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="grid sm:col-span-2">
                  <p className="font-semibold">Quotation Terms/Remarks</p>
                  <p className="text-muted-foreground text-xs pt-1 leading-relaxed">
                    {quotation.remarks}
                  </p>
                </div>
                <div className="grid">
                  <div className="">
                    <p className="font-semibold">Quotation Submission Date</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {format(new Date(quotation.created_date), "PPPPp")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form action={submitContract}>
          <div className="section-content !p-0 overflow-hidden">
            <input type="hidden" name="quotation_id" value={quotation.id} />
            <input type="hidden" name="rfq_id" value={quotation.rfq.id} />
            <h2 className="font-semibold p-2 text-lg border-b text-center bg-accent text-accent-foreground">
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
                  <p className="p-2 rounded-sm border text-sm">{user.name}</p>
                </div>
                <div className="grid gap-1">
                  <Label
                    htmlFor="terms_and_conditions"
                    className="font-semibold"
                  >
                    Vendor
                  </Label>
                  <p className="p-2 rounded-sm border text-sm">
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
                  <p className="p-2 rounded-sm border text-sm">
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
