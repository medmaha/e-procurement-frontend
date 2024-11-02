import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { RFQResponseContent } from "@/app/vendors/rfq-requests/Components/ViewRFQResponse";
import { isDeadlineDate } from "../helpers";
import LockedRFQResponse from "../Components/LockedRFQResponse";

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return redirect("/account/login?next=/procurement/rfq");
  }

  const slug = props.params.slug;

  // TODO Validate slug

  const response = await actionRequest<RFQResponse>({
    method: "get",
    url: "/procurement/rfq/responses/" + slug + "/",
  });

  if (!response.success) return <Page404 error={response} />;

  console.log("Date:", response.data.rfq.quotation_deadline_date);

  const deadline = isDeadlineDate(response.data.rfq.quotation_deadline_date);

  if (!deadline) {
    return (
      <section className="section">
        <div className="block pt-10">
          <LockedRFQResponse data={response.data} />
        </div>
        {format(new Date(response.data.deadline), "PPPPp")}
      </section>
    );
  }

  const rfqResponse = response.data;
  const permissions = response.auth_perms;

  return (
    <section className="section">
      <div className="section-heading">
        <div className="grid items-start justify-start">
          <div className="pb-1">
            <GoBack />
          </div>
          <p className="text-sm font-semibold text-muted-foreground inline-flex items-center gap-2">
            Response Status:{" "}
            {rfqResponse.status?.toLowerCase() === "accepted" ? (
              <span className=" inline-flex items-center gap-1">
                <CheckCircle2
                  className="text-green-500"
                  width={16}
                  height={16}
                />
                <small className="text-green-500">ACCEPTED</small>
              </span>
            ) : (
              <span className=" inline-flex items-center gap-1">
                <XCircle className="text-destructive" width={16} height={16} />
                <small className="text-destructive">REJECTED</small>
              </span>
            )}
          </p>
        </div>
        <div className="">
          <h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
            RFQ Response{" "}
            <span className="text-muted-foreground">
              {rfqResponse.unique_id}
            </span>{" "}
            Details
          </h1>
          <p className="text-sm text-muted-foreground pt-1.5">
            Date Joined:{" "}
            <span className="font-semibold">
              {format(new Date(rfqResponse.created_date), "PPPPp")}
            </span>
          </p>
        </div>
      </div>
      <div className="section-content">
        <RFQResponseContent data={rfqResponse} user={user} hideStatus={true} />
      </div>
    </section>
  );
}
