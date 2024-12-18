"use client";
import { useState, lazy, Suspense } from "react";
import AddOrEditRequisition from "./Components/AddOrEditRequisition";
import RequisitionsTable from "./Components/RequisitionTable";
import { Button } from "@/Components/ui/button";
import Header from "./Header";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";

type Props = {
  readonly user: AuthUser;
};

const RequisitionCardLazy = lazy(() => import("./Components/RequisitionCard"));
const LazyRequisitionApproval = lazy(
  () => import("./Components/RequisitionApproval")
);
const LazyRequisitionEditComponent = lazy(
  () => import("./Components/AddOrEditRequisition")
);
const LazyRequisitionModalComponent = lazy(
  () => import("./Components/RequisitionModal")
);

export default function Container({ user }: Props) {
  const [gridView, setGridView] = useState(false);
  const [permissions, setPermissions] = useState<AuthPerm>();

  const [LazyComponent, setLazyComponent] = useState<any>();
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition>();

  const requisitionsQuery = useQuery({
    staleTime: Infinity,
    queryKey: ["requisitions", user?.meta?.id],
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
      {LazyComponent && (
        <Suspense>
          <LazyComponent
            autoOpen
            user={user}
            onClose={() => {
              setLazyComponent(undefined);
              setSelectedRequisition(undefined);
            }}
            requisition={selectedRequisition}
          />
        </Suspense>
      )}

      <Header
        user={user}
        permissions={permissions || ({} as any)}
        gridView={gridView}
        setGridView={setGridView}
        createRequisition={() => {
          setSelectedRequisition(undefined);
          setLazyComponent(LazyRequisitionEditComponent);
        }}
      />

      {!gridView && (
        <RequisitionsTable
          user={user}
          permission={permissions}
          loading={requisitionsQuery.isLoading}
          requisitions={requisitionsQuery.data || []}
          viewRequisition={(requisition_id) => {
            setSelectedRequisition(
              requisitionsQuery.data?.find(
                (r) => r.id.toString() === requisition_id.toString()
              )
            );
            setLazyComponent(LazyRequisitionModalComponent);
          }}
          updateRequisition={(requisition_id) => {
            setSelectedRequisition(
              requisitionsQuery.data?.find(
                (r) => r.id.toString() === requisition_id.toString()
              )
            );
            setLazyComponent(LazyRequisitionEditComponent);
          }}
          approveRequisition={(requisition_id) => {
            setSelectedRequisition(
              requisitionsQuery.data?.find(
                (r) => r.id.toString() === requisition_id.toString()
              )
            );
            setLazyComponent(LazyRequisitionApproval);
          }}
        />
      )}

      {gridView && (
        <>
          {requisitionsQuery.data && requisitionsQuery.data.length > 0 ? (
            <div className="mt-6 grid sm:grid-cols-2 sm:gap-6 gap-4">
              <Suspense>
                {requisitionsQuery.data.map((requisition) => (
                  <RequisitionCardLazy
                    key={requisition.id}
                    user={user}
                    requisition={requisition}
                    viewRequisition={(requisition_id) => {
                      setSelectedRequisition(
                        requisitionsQuery.data?.find(
                          (r) => r.id.toString() === requisition_id.toString()
                        )
                      );
                      setLazyComponent(LazyRequisitionModalComponent);
                    }}
                    updateRequisition={(requisition_id) => {
                      setSelectedRequisition(
                        requisitionsQuery.data?.find(
                          (r) => r.id.toString() === requisition_id.toString()
                        )
                      );
                      setLazyComponent(LazyRequisitionEditComponent);
                    }}
                    approveRequisition={(requisition_id) => {
                      setSelectedRequisition(
                        requisitionsQuery.data?.find(
                          (r) => r.id.toString() === requisition_id.toString()
                        )
                      );
                      setLazyComponent(LazyRequisitionApproval);
                    }}
                  />
                ))}
              </Suspense>
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
