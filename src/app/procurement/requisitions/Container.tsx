"use client";
import React, { useState } from "react";
import AddOrEditRequisition from "./Components/AddOrEditRequisition";
import RequisitionCard from "./Components/RequisitionCard";
import RequisitionsTable from "./Components/RequisitionTable";
import { Button } from "@/Components/ui/button";
import Header from "./Header";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";
import Approval from "./Components/Approval";

type Props = {
  readonly user: AuthUser;
};

export default function Container({ user }: Props) {
  const [gridView, setGridView] = useState(false);
  const [permissions, setPermissions] = useState<AuthPerm>();
  const [selectedForUpdate, setSelectedForUpdate] = useState<Requisition>();
  const [selectedForApproval, setSelectedForApproval] = useState<Requisition>();

  const requisitionsQuery = useQuery({
    staleTime: Infinity,
    queryKey: ["requisitions"],
    queryFn: async () => {
      const response = await actionRequest<Requisition[]>({
        method: "get",
        url: "/procurement/requisitions/",
      });
      if (response.success) {
        setPermissions(response.auth_perms);
        return response.data;
      }
      throw response;
    },
  });

  return (
    <>
      {selectedForUpdate && (
        <AddOrEditRequisition
          autoOpen
          user={user}
          onClose={() => setSelectedForUpdate(undefined)}
          requisition={selectedForUpdate}
        />
      )}
      {selectedForApproval && (
        <Approval
          autoOpen
          user={user}
          onClose={() => setSelectedForApproval(undefined)}
          requisition={selectedForApproval}
          department={selectedForApproval.officer.department}
        />
      )}

      <Header
        user={user}
        permissions={permissions || ({} as any)}
        gridView={gridView}
        setGridView={setGridView}
      />

      {!gridView && (
        <RequisitionsTable
          user={user}
          loading={requisitionsQuery.isLoading}
          requisitions={requisitionsQuery.data || []}
          updateRequisition={(requisition_id) => {
            alert(requisition_id);
            setSelectedForUpdate(
              requisitionsQuery.data?.find(
                (r) => r.id.toString() === requisition_id.toString()
              )
            );
          }}
          approveRequisition={(requisition_id) =>
            setSelectedForApproval(
              requisitionsQuery.data?.find(
                (r) => r.id.toString() === requisition_id.toString()
              )
            )
          }
        />
      )}

      {gridView && (
        <>
          {requisitionsQuery.data && requisitionsQuery.data.length > 0 ? (
            <div className="mt-6 grid sm:grid-cols-2 sm:gap-6 gap-4">
              {requisitionsQuery.data.map((requisition) => (
                <RequisitionCard
                  key={requisition.id}
                  user={user}
                  department={requisition.officer.department}
                  requisition={requisition}
                />
              ))}
            </div>
          ) : (
            !requisitionsQuery.isLoading && (
              <div className="p-6">
                <h5 className="font-semibold text-xl">
                  No requisitions found for you.
                </h5>
                <p className="text-muted-foreground leading-relaxed max-w-[60ch] pt-2">
                  Requisition is a formal request for products or services that
                  initiates the procurement process. It outlines specific needs
                  and seeks approval to begin the purchasing process.
                </p>
                {permissions?.create && (
                  <div className="pt-4">
                    <AddOrEditRequisition user={user}>
                      <Button className="">+ New Requisition</Button>
                    </AddOrEditRequisition>
                  </div>
                )}
              </div>
            )
          )}
        </>
      )}
    </>
  );
}
