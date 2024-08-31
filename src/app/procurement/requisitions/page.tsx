import { Check, Info, Loader2, X } from "lucide-react";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import React from "react";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import EditRequisition from "./Components/EditRequisition";
import RequisitionCard from "./Components/RequisitionCard";

export const metadata: Metadata = {
  title: "Requisitions | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/account/login?next=/procurement/requisitions");
  }

  const response = await actionRequest<Requisition[]>({
    method: "get",
    url: "/procurement/requisitions/",
  });

  if (!response.success) {
    return <p>{response.message}</p>;
  }

  const requisitions = response.data;
  const permissions = response.auth_perms;

  function requisitionByStatus(status: string) {
    return requisitions?.filter(
      (requisition) => requisition?.approval.status.toLowerCase() == status
    );
  }

  const acceptedRequisitions = requisitionByStatus("accepted");
  const rejectedRequisitions = requisitionByStatus("rejected");
  const pendingRequisitions = requisitionByStatus("pending");

  return (
    <section className="section">
      <div className="section-heading">
        <div className="grid">
          <h1 className="section-text	">Requisitions</h1>
          <div className="grid px-2 pt-2 gap-1">
            {pendingRequisitions.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={"16"} className="text-primary" />
                  <span className="text-xs">
                    <span className="font-bold">
                      {pendingRequisitions.length}
                    </span>{" "}
                    Pending{" "}
                    {pluralize("Requisition", pendingRequisitions.length)}
                  </span>
                </span>
              </p>
            )}
            {acceptedRequisitions.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Check size={"16"} className="text-primary" />
                  <span className="text-xs">
                    <span className="font-bold">
                      {acceptedRequisitions.length}
                    </span>{" "}
                    Approved{" "}
                    {pluralize("Requisition", acceptedRequisitions.length)}
                  </span>
                </span>
              </p>
            )}
            {rejectedRequisitions.length > 0 && (
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Info size={"16"} className="text-destructive" />
                  <span className="text-xs">
                    <span className="font-bold">
                      {rejectedRequisitions.length}
                    </span>{" "}
                    <span className=" min-w-[20ch]">
                      Rejected{" "}
                      {pluralize("Requisition", rejectedRequisitions.length)}
                    </span>
                  </span>
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="grid items-center">
          {/* <AddRequisition text={"Add Requisition"} /> */}
          {permissions.create && (
            <EditRequisition user={user}>
              <Button className="font-semibold lg:text-lg">
                + New Requisition
              </Button>
            </EditRequisition>
          )}
        </div>
      </div>

      {requisitions.length > 0 ? (
        <div className="mt-6 grid sm:grid-cols-2 sm:gap-6 gap-4">
          {requisitions.map((requisition) => (
            <RequisitionCard
              key={requisition.id}
              user={user}
              department={requisition.officer.department}
              requisition={requisition}
            />
          ))}
        </div>
      ) : (
        <div className="p-6">
          <h5 className="font-semibold text-xl">
            No requisitions found for you.
          </h5>
          <p className="text-muted-foreground leading-relaxed max-w-[60ch] pt-2">
            Requisition is a formal request for products or services that
            initiates the procurement process. It outlines specific needs and
            seeks approval to begin the purchasing process.
          </p>
          {permissions.create && (
            <div className="pt-4">
              <EditRequisition user={user}>
                <Button className="font-semibold text-lg p-2">
                  + New Requisition
                </Button>
              </EditRequisition>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
