import { Check, Loader2, X } from "lucide-react";
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
          <div className="">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Requests for Quotation
            </h2>
          </div>
          <div className="grid px-2 pt-1">
            {activeRFQ.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-4">
                  <Check size={"16"} className="text-primary" />
                  <span className="text-xs">
                    <span className="font-bold">{activeRFQ.length}</span>{" "}
                    Published {pluralize("RFQ", activeRFQ.length)}
                  </span>
                </span>
              </p>
            )}
            {inactiveRFQ.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-4">
                  <Loader2 size={"16"} className="text-accent-foreground" />
                  <span className="text-xs">
                    <span className="font-bold">{inactiveRFQ.length}</span>{" "}
                    <span className=" min-w-[20ch]">
                      Unpublished {pluralize("RFQ", inactiveRFQ.length)}
                    </span>
                  </span>
                </span>
              </p>
            )}
          </div>
        </div>
        {permissions.create && (
          <div className="grid">
            <AddRFQ text="+ Create RFQ" user={user} />
          </div>
        )}
      </div>
      {/* Searching and filtering */}
      <div className="section-content !mb-2 !bg-accent flex gap-4 md:gap-8 flex-wrap items-center">
        <div className="grid grid-cols-3  gap-4 md:gap-8 w-full">
          <FilterByYear defaultValue={props.searchParams.year} />
          <FilterByVendor name="rfq" defaultValue={props.searchParams.rfq} />
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
