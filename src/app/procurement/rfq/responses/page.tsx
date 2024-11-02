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

  const acceptedQuotes = quotesByStatus("approved");
  const rejectedQuotes = quotesByStatus("rejected");

  const rfq = quotationsCanBeEvaluated(quotations, user);
  const deadline = rfq ? isDeadlineDate(rfq.quotation_deadline_date) : false;

  return (
    <section className="section">
      <ClientSitePage page={{ title: "Quotation Responses" }} />
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
                  RFQ Evaluation
                </Button>
              </EvaluateQuotations>
            </div>
          )}
        </div>
      </div>
      {/* Data */}
      <RFQResponseTable data={quotations} user={user} />
    </section>
  );
}
