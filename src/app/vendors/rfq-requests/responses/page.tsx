import { format, formatDistance } from "date-fns";
import { Check, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import ViewRFQResponse from "../Components/ViewRFQResponse";
import Page404 from "@/app/not-found";
import { Badge } from "@/Components/ui/badge";
import RFQResponseTable from "../Components/RFQResponseTable";

export default async function page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/account/login?next=/vendors/rfq-requests/responses");
  }

  const response = await actionRequest<RFQResponse[]>({
    method: "get",
    url: "/vendors/rfq-responses/",
  });

  if (!response.success) return <Page404 error={response} />;

  const rfqResponses = response.data;
  function quotesByStatus(status: RFQResponse["approved_status"]) {
    return rfqResponses.filter(
      (response) => response.approved_status === status
    );
  }

  const acceptedQuotes = quotesByStatus("ACCEPTED");
  const rejectedQuotes = quotesByStatus("REJECTED");
  const pendingQuoteResponse = quotesByStatus("PROCESSING");

  return (
    <section className="p-6">
      <div className="p-6 rounded-lg shadow border bg-card text-card-foreground mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-xl sm:text-3xl font-bold">
            RFQ Response Tracking
          </h1>
          <div className="grid px-2 pt-1">
            {acceptedQuotes.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2.5">
                  <Check size={"16"} className="text-primary" />
                  <span className="text-xs">
                    <span className="font-bold">{acceptedQuotes.length}</span>{" "}
                    Accepted {pluralize("Quotation", acceptedQuotes.length)}
                  </span>
                </span>
              </p>
            )}
            {rejectedQuotes.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2.5">
                  <Info size={"16"} className="text-destructive" />
                  <span className="text-xs">
                    <span className="font-bold">{rejectedQuotes.length}</span>{" "}
                    <span className=" min-w-[20ch]">
                      Rejected {pluralize("Quotation", rejectedQuotes.length)}
                    </span>
                  </span>
                </span>
              </p>
            )}
            {pendingQuoteResponse.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2.5">
                  <Loader2 size={"16"} className="text-primary" />
                  <span className="text-xs">
                    <span className="font-bold">
                      {pendingQuoteResponse.length}
                    </span>{" "}
                    <span className=" min-w-[20ch]">
                      Pending{" "}
                      {pluralize("Quotation", pendingQuoteResponse.length)}
                    </span>
                  </span>
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <RFQResponseTable user={user} data={rfqResponses} />

      <pre>
        <code>{JSON.stringify(rfqResponses, null, 4)}</code>
      </pre>
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
