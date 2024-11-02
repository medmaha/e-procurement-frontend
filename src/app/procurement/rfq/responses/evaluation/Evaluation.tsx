"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { retrieveRFQ } from "../../actions";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { generate_unique_id } from "@/lib/helpers/generator";
import { EyeIcon, LinkIcon, Loader2, Settings2Icon, Vote } from "lucide-react";
import EvaluationTable from "./EvaluationTable";
import { refreshPage } from "./actions";
import Link from "next/link";
import ViewRFQResponse from "@/app/vendors/rfq-requests/Components/ViewRFQResponse";

type Props = {
  quotations: RFQResponse[];
  rfq_id: ID;
  children: ReactNode;
  user: AuthUser;
};

export default function EvaluateQuotations({
  quotations,
  user,
  ...props
}: Props) {
  const [rfq, setRFQ] = useState<RFQ>();
  const [isOpen, toggleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reviewQuotation, toggleReviewQuotation] = useState<RFQResponse>();

  const ready = useMemo(() => {
    const _ready = quotations.reduce((acc, cur) => {
      if (cur.status.toLowerCase() === "rejected") return true;
      return Number(cur.evaluation?.length) === rfq?.items.length;
    }, false);

    return _ready && rfq;
  }, [quotations, rfq]);

  useEffect(() => {
    const rfq_id = props.rfq_id;
    let timeout: NodeJS.Timeout | undefined = undefined;
    async function retrieve() {
      setLoading(!rfq);
      const response = await retrieveRFQ(rfq_id);
      setLoading(false);
      if (response.success) {
        setRFQ(response.data);
      } else {
        toast.error("ERROR! Unable to retrieve RFQ");
      }
    }

    if (isOpen) {
      retrieve();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [props.rfq_id, isOpen]);

  async function updateReload() {
    refreshPage(location.pathname);
    return Promise.resolve();
  }

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-h-[95svh] h-full 2xl:max-w-[1000px] flex flex-col overflow-hidden overflow-y-auto w-full max-w-[95svw]">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-semibold">
            RFQ{" "}
            <span tabIndex={1} className="text-muted-foreground">
              ({generate_unique_id("RFQ", props.rfq_id)})
              <span className="sr-only">RFQ ID</span>
            </span>{" "}
            Evaluation
            {ready && (
              <div className="inline-flex items-center float-right mr-6 pr-2">
                <Link href={`/procurement/rfq/${rfq?.id}/evaluation`}>
                  <Button className="md:font-semibold md:text-base">
                    Evaluation Result
                  </Button>
                </Link>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Review and evaluate the responses received for your request for
            quotation
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[35svh] w-full flex-1">
          {rfq && (
            <div
              className={`grid w-full grid-cols-1 ${
                loading ? "opacity-50 animate-pulse pointer-events-none" : ""
              }`}
            >
              {rfq.items.map((item, i) => {
                return (
                  <EvaluationTable
                    updateReload={updateReload}
                    index={i}
                    item={item}
                    quotations={quotations}
                    user={user}
                    rfq={rfq}
                    key={item.id}
                    review={(data: RFQResponse) => toggleReviewQuotation(data)}
                  />
                );
              })}
            </div>
          )}
          {loading && (
            <div className="block text-center pt-16 lg:pt-24 p-6 min-h-[80px]">
              <p className="w-max mx-auto text-center p-1">
                <Loader2 className="animate-spin text-sky-500 mx-auto" />
                Please wait while we fetch the RFQ details{" "}
              </p>
            </div>
          )}
        </div>

        {reviewQuotation && (
          <ViewRFQResponse
            data={{
              ...reviewQuotation,
              rfq: rfq || reviewQuotation.rfq,
            }}
            user={user}
            autoFocus
            onClose={() => toggleReviewQuotation(undefined)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
