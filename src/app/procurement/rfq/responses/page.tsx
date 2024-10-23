import { Check, Info, LinkIcon, Vote } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import ClientSitePage from "@/Components/ui/ClientSitePage";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import FilterByRFQ from "../Component/FilterByRFQ";
import FilterByYear from "../Component/FilterByYear";
import { convertUrlSearchParamsToSearchString } from "@/lib/helpers/transformations";
import RFQResponseTable from "./Components/RFQResponseTable.tsx";
import FilterBySearch from "../Component/FilterBySearch";
import { isDeadlineDate, quotationsCanBeEvaluated } from "./helpers";
import EvaluateQuotations from "./evaluation/Evaluation";
import { Button } from "@/Components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "RFQ Quotations | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/account/login?next=/procurement/rfq/responses");
  }

  const searchString = convertUrlSearchParamsToSearchString(props.searchParams);

  const response = await actionRequest<RFQResponse[]>({
    method: "get",
    url: "/procurement/rfq/responses/list/" + searchString,
  });

  if (!response.success) return <Page404 error={response} />;

  const quotations = response.data;

  function quotesByStatus(status: RFQResponse["status"]) {
    return quotations.filter(
      (quote) => quote?.status?.toLowerCase() === status.toLowerCase()
    );
  }

  const acceptedQuotes = quotesByStatus("ACCEPTED");
  const rejectedQuotes = quotesByStatus("REJECTED");

  const rfq = quotationsCanBeEvaluated(quotations, user);
  const deadline = rfq ? isDeadlineDate(rfq.deadline) : false;


  return (
    <section className="section">
      <ClientSitePage
        search={{
          model_name: "RFQ Response",
          model_fields: "id, date, vendor, deadline, etc",
        }}
      />
      <div className="section-heading !mb-2">
        <div className="flex justify-between items-center gap-4 md:gap-8 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            RFQ Responses
          </h1>
        </div>
        <div className="grid px-2 pt-1">
          {acceptedQuotes.length > 0 && (
            <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-4">
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
              <span className="inline-flex items-center gap-4">
                <Info size={"16"} className="text-destructive" />
                <span className="text-xs">
                  <span className="font-bold">{rejectedQuotes.length}</span>{" "}
                  <span className=" min-w-[20ch]">
                    Declined {pluralize("Quotation", rejectedQuotes.length)}
                  </span>
                </span>
              </span>
            </p>
          )}
        </div>
      </div>
      {/* Searching and filtering */}
      <div className="section-content !bg-accent !mb-2 flex gap-4 md:gap-8 flex-wrap items-center">
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1 flex-wrap">
          <div className="flex gap-4">
            <FilterByRFQ defaultValue={props.searchParams.rfq} />
            <FilterByYear defaultValue={props.searchParams.year} />
          </div>
          <FilterBySearch
            name="search"
            defaultValue={props.searchParams.search}
            placeholder="Search for RFQ"
          />
          {deadline && rfq && (
            <div className="flex flex-wrap items-center md:justify-center gap-2">
              <EvaluateQuotations
                user={user}
                quotations={quotations}
                rfq_id={rfq.id}
              >
                <Button className="md:text-base h-9 sm:font-semibold gap-1.5">
                  <Vote className="w-4 h-4" />
                  <span>RFQ Evaluation</span>
                </Button>
              </EvaluateQuotations>
              <Link className="" href={`/form-101?m=rfq&i=${rfq.id}`}>
                <Button
                  // variant={"outline"}
                  className="sm:font-semibold h-9 md:text-base gap-1.5 border hover:bg-primary hover:text-primary-foreground"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>RFQ Details</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Data */}
      <RFQResponseTable data={quotations} user={user} />
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
