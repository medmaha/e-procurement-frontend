"use client";
import React, { useState } from "react";
import EditRequisition from "./Components/EditRequisition";
import RequisitionCard from "./Components/RequisitionCard";
import RequisitionsTable from "./Components/RequisitionTable";
import { Button } from "@/Components/ui/button";
import Header from "./Header";

type Props = {
  readonly user: AuthUser;
  readonly permissions: AuthPerm;
  readonly requisitions: Requisition[];
};

export default function Container({ user, requisitions, permissions }: Props) {
  const [gridView, setGridView] = useState(true);

  return (
    <>
      <Header
        user={user}
        permissions={permissions}
        gridView={gridView}
        setGridView={setGridView}
      />

      {!gridView && (
        <RequisitionsTable user={user} requisitions={requisitions} />
      )}

      {gridView && (
        <>
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
                initiates the procurement process. It outlines specific needs
                and seeks approval to begin the purchasing process.
              </p>
              {permissions.create && (
                <div className="pt-4">
                  <EditRequisition user={user}>
                    <Button className="">+ New Requisition</Button>
                  </EditRequisition>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
