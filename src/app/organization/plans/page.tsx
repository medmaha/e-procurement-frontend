import { Check, Info } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddAnnualPlan from "./Components/AddAnnualPlan";
import AddPlan from "./Components/AddDepartmentalPlan";
import FilterByYear from "./Components/FilterByYear";
import { RequestAnnualPlanApproval } from "./Components/RequestAnnualPlanApproval";
import Page404 from "@/app/not-found";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export const revalidate = 10;

interface Props {
  searchParams: {
    [key: string]: string;
  };
}

export const metadata: Metadata = {
  title: "Annual Procurement Plans | E-Procurement",
  description: "Annual procurement plans page",
  keywords: "plans, annual, gppa, organization, procurement, e-procurement",
};

export default async function Page(props: Props) {
  // State and functions to handle procurement plan logic can be added here
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/plans");
  }
  const year = props.searchParams.year;
  const thisYear = new Date().getFullYear().toString();
  const response = await actionRequest<AnnualPlan, { dept_perms: AuthPerm }>({
    method: "get",
    url: "/organization/annual-plan/current/" + (year ? "?year=" + year : ""),
  });
  if (!response.success) return <Page404 error={response} />;

  const annualPlan = response.data;
  const permissions = response.auth_perms;

  const dept_permissions = response.extras.dept_perms;

  const NO_ANNUAL_PLAN = Boolean(response.data) === false;

  const userIsAuthor = user.profile_id === annualPlan?.officer?.id;

  return (
    <section className="section">
          <ClientSitePage
        page={{
          title:"Annual Procurement Plan"
        }}
      />
      <div className="section-heading">
        <div className="flex justify-between sm:justify-start flex-1 items-center gap-4">
          <h1 className="font-bold text-lg w-max flex text-center">
            Annual Plan
          </h1>
          <span className="inline-flex items-center gap-2 text-sm sm:pl-6 md:pl-16">
            Year: <FilterByYear value={props.searchParams.year} />
          </span>
        </div>
        {NO_ANNUAL_PLAN && permissions.create && (
          <AddAnnualPlan text="Add Annual Plan" />
        )}
        {userIsAuthor && annualPlan?.request_for_approval_org && (
          <div className="flex items-center">
            <RequestAnnualPlanApproval
              annualPlan={annualPlan}
              user={user}
              requestType={"ORG"}
            />
          </div>
        )}
        {userIsAuthor && annualPlan?.request_for_approval_gppa && (
          <div className="flex items-center">
            <RequestAnnualPlanApproval
              annualPlan={annualPlan}
              user={user}
              requestType={"GPPA"}
            />
          </div>
        )}
        {!NO_ANNUAL_PLAN && (
          <>
            {!!(
              !annualPlan.request_for_approval_org ||
              !annualPlan.request_for_approval_org
            ) && (
              <>
                {userIsAuthor && annualPlan?.request_for_approval_both && (
                  <div className="flex items-center">
                    <RequestAnnualPlanApproval
                      annualPlan={annualPlan}
                      user={user}
                      requestType={"BOTH"}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {NO_ANNUAL_PLAN ? (
        <div className="">
          <div className="md:p-8 sm:p-6 p-4 max-w-[600px] mx-auto flex flex-col gap-8 items-center bg-card text-card-foreground rounded-lg border">
            <h1 className="font-bold text-xl sm:text-2xl text-center w-full">
              Your Organization Has No Annual Procurement Plan <br />
              {year && thisYear !== year ? (
                <>
                  <span className="pt-4 inline-block">For Year</span>{" "}
                  <span className="font-extrabold">{year}</span>
                </>
              ) : (
                ""
              )}
            </h1>
            {permissions.create && (
              <div className="flex items-center flex-1 justify-end">
                <AddAnnualPlan />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <div className="grid">
              <h2 className="font-bold text-xl grid">
                {annualPlan.title}
                {annualPlan.officer && (
                  <small className="text-muted-foreground text-sm font-medium">
                    Created by{" "}
                    <Link
                      href={
                        "/organization/staffs/" + (annualPlan.officer as any).id
                      }
                      className="text-primary opacity-90 hover:opacity-100  underline underline-offset-2"
                    >
                      {annualPlan.officer.name}
                    </Link>
                  </small>
                )}
              </h2>
              {annualPlan.name && <p>{annualPlan.name}</p>}
              <p className="text-xs opacity-80 line-clamp-2 max-w-[50ch]">
                {annualPlan.description}
              </p>
            </div>

            <div className="grid grid-cols-1 items-center justify-center text-xs">
              <p className="flex gap-2 items-center">
                <span>
                  {annualPlan.org_approved ? (
                    <Check className="text-primary mt-1" size={"14"} />
                  ) : (
                    <Info className="text-destructive mt-1" size={"14"} />
                  )}
                </span>
                <span className="font-semibold">Approved By Organization</span>
              </p>
              <p className="flex gap-2 items-center">
                <span>
                  {annualPlan.gppa_approved ? (
                    <Check className="text-primary mt-1" size={"14"} />
                  ) : (
                    <Info className="text-destructive mt-1" size={"14"} />
                  )}
                </span>
                <span className="font-semibold">Approved By GPPA</span>
              </p>
              <p className="flex gap-2 items-center">
                <span>
                  {annualPlan.is_operational ? (
                    <Check className="text-primary mt-1" size={"14"} />
                  ) : (
                    <Info className="text-destructive mt-1" size={"14"} />
                  )}
                </span>
                <span className="font-semibold">In Operation</span>
              </p>
            </div>
            {dept_permissions?.create && (
              <div className="flex items-end">
                <div className="grid gap-2">
                  <AddPlan />
                </div>
              </div>
            )}
          </div>

          {!annualPlan.department_plans?.length ? (
            <div className="bg-card text-card-foreground p-6 rounded overflow-hidden overflow-x-auto border">
              <h3 className="font-bold text-xl sm:text-2xl text-center">
                No Department Procurement Plan
              </h3>
              <div className="flex items-center flex-1 justify-center pt-4">
                {dept_permissions?.create && <AddPlan text={"Add One Now!"} />}
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table w-full text-sm">
                <thead className="">
                  <tr>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary dark:border-l-secondary">
                      <small className="p-0.5">#</small>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Item Name</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Qty</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary">
                      <span className="p-1">M-Unit</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Budget</span>
                    </th>
                    {/* <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Method</span>
                    </th> */}
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Quarter 1</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Quarter 2</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary ">
                      <span className="p-1">Quarter 3</span>
                    </th>
                    <th className="bg-secondary dark:border-card dark:border-t-secondary dark:border-r-secondary">
                      <span className="p-1">Quarter 4</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {annualPlan.department_plans.map((plan) => (
                    <ProcurementPlan key={plan.id} plan={plan} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

type AProps = {
  plan: DepartmentProcurementPlan;
};
function ProcurementPlan({ plan }: AProps) {
  return (
    <>
      <tr className="">
        <td colSpan={9} className="py-4">
          <h3 className="text-center text-lg font-semibold py-2">
            {plan.department?.name}
          </h3>
        </td>
      </tr>
      {plan?.items?.map((item, idx) => (
        <tr key={item.id} className="">
          <td className="">
            <small className="">{idx + 1}.</small>
          </td>
          <td className="">{item.description}</td>
          <td className="">{item.quantity}</td>
          <td className="">{item.measurement_unit}</td>
          <td className="capitalize">
            D{formatNumberAsCurrency(Number(item.budget))}
          </td>
          {/* <td className="">{item.procurement_method}</td> */}
          <td className="">
            D{formatNumberAsCurrency(Number(item.quarter_1_budget))}
          </td>
          <td className="">
            D{formatNumberAsCurrency(Number(item.quarter_2_budget))}
          </td>
          <td className="">
            D{formatNumberAsCurrency(Number(item.quarter_3_budget))}
          </td>
          <td className="">
            D{formatNumberAsCurrency(Number(item.quarter_4_budget))}
          </td>
        </tr>
      ))}
    </>
  );
}
