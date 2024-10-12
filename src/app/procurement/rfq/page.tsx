import { Check, Loader2, SearchIcon, X } from "lucide-react";
import React from "react";
import Page404 from "@/app/not-found";
import ClientSitePage from "@/Components/ui/ClientSitePage";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddRFQ from "./Component/CreateRFQ";
import RFQTable from "./Component/RFQTable";
import FilterByYear from "./Component/FilterByYear";
import FilterByVendor from "./Component/FilterBySearch";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export const metadata = {
  title: "RFQ | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", `/procurement/rfq`, props.searchParams);
  }

  const searchString = searchParamsToSearchString(props.searchParams);

  const response = await actionRequest<RFQ[]>({
    method: "get",
    url: "/procurement/rfq/" + searchString,
  });

  if (!response.success) return <Page404 error={response} />;

  const rfqArray = response.data;
  const permissions = response.auth_perms;

  function rfqByStatus(status: boolean) {
    return rfqArray?.filter((rfq) => rfq.published === status) || [];
  }
  const activeRFQ = rfqByStatus(true);
  const inactiveRFQ = rfqByStatus(false);

  return (
    <section className="section">
      <ClientSitePage
        search={{ model_name: "RFQ", model_fields: "id, date, vendor" }}
      />
      <div className="section-heading !mb-2">
        <div
          className={`${
            !permissions.create
              ? "flex justify-between gap-4 flex-wrap  w-full"
              : "grid flex-1"
          } h-full items-center`}
        >
          <h2 className="heading-text">Requests for Quotation</h2>
        </div>
        {permissions.create && (
          <div className="grid">
            <AddRFQ text="+ Create RFQ" user={user} />
          </div>
        )}
      </div>
      {/* Searching and filtering */}
      <div className="flex items-center flex-wrap gap-4 md:gap-8 w-full p-2.5 border rounded-lg mb-2 bg-secondary/50">
        <FilterByYear defaultValue={props.searchParams.year} />
        <div className="relative">
          <Input
            className="md:w-[300px] lg:w-[400px] pr-4"
            placeholder="Search by staff name or unit"
          />
          <Button
            variant="secondary"
            size={"icon"}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* DATA */}
      <RFQTable data={rfqArray} user={user} />

      {permissions.create && rfqArray.length < 1 && (
        <div className="grid gap-2 pt-6 w-max">
          <AddRFQ text="+ Request for Quotation" user={user} />
        </div>
      )}
      {/* Additional content or RFQ list can be added here */}
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
