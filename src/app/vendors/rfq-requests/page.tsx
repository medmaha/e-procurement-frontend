import { Loader2 } from "lucide-react";
import React from "react";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { returnTo } from "@/lib/server/urls";
import APP_COMPANY from "@/APP_COMPANY";
import RFQRequestTable from "./Components/RFQRequestTable";

export default async function page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return returnTo(
      "/account/login",
      "/vendors/rfq-requests",
      props.searchParams
    );
  }
  const response = await actionRequest<RFQRequest[]>({
    method: "get",
    url: "/vendors/rfq-requests/",
  });

  if (!response.success) {
    return <Page404 error={response} />;
  }
  const rfqRequests = response.data;
  function quotesByStatus(responded: boolean) {
    return rfqRequests.filter((rfq) => rfq.responded === responded);
  }

  const pendingRFQRequest = quotesByStatus(false);

  return (
    <section className="section">
      <div className="section-heading">
        <div className="">
          <h1 className="heading-text">RFQ Invitations</h1>
          <p className="heading-desc">
            All Invitations for RFQ FORM-101 issued by <b>{APP_COMPANY.name}</b>
          </p>
        </div>
        <div className="grid px-2 pt-1">
          {pendingRFQRequest.length > 0 && (
            <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-4">
                <Loader2 size={"16"} className="text-primary" />
                <span className="text-xs">
                  Pending{" "}
                  <span className="font-bold">{pendingRFQRequest.length}</span>{" "}
                  {pluralize("Invitation", pendingRFQRequest.length)}
                </span>
              </span>
            </p>
          )}
        </div>
      </div>
      <RFQRequestTable user={user} data={rfqRequests} />
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
