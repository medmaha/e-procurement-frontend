import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import RequisitionDetail from "../Components/RequisitionDetail";
import { generate_unique_id } from "@/lib/helpers/generator";

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return redirect("/account/login?next=/procurement/rfq");
  }

  const slug = props.params.slug;

  // TODO Validate slug

  const response = await actionRequest<RequisitionRetrieve>({
    method: "get",
    url: "/procurement/requisitions/" + slug + "/",
  });

  if (!response.success) return <Page404 error={response} />;

  const requisition = response.data;

  return (
    <section className="section">
      <div className="section-heading">
        <div className="grid items-start justify-start">
          <div className="pb-1">
            <GoBack />
          </div>
        </div>
        <div className="">
          <h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
            Requisition{" "}
            <span className="text-muted-foreground">
              {generate_unique_id("REQ", requisition.id)}
            </span>{" "}
            Details
          </h1>
          <p className="text-sm text-muted-foreground pt-1.5">
            Date Created:{" "}
            <span className="font-semibold">
              {format(new Date(requisition.created_date), "PPPPp")}
            </span>
          </p>
        </div>
      </div>
      <div className="section-content">
        <RequisitionDetail loading={false} data={requisition} user={user} />
        {/* <div className="grid pt-6">
          <h3 className="font-semibold text-lg">Approval Status</h3>
          <RequisitionApprovalContent
            requisition={requisition}
            showStatusText={true}
          />
        </div> */}
      </div>
    </section>
  );
}
