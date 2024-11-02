import { Check, Info, SearchIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddDepartment from "./Components/AddDepartment";
import DisableDepartment from "./Components/DisableDepartment";
import EnableDepartment from "./Components/EnableDepartment";
import ViewDepartment from "./Components/ViewDepartment";
import { generate_unique_id } from "@/lib/helpers/generator";
import { Input } from "@/Components/ui/input";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export const metadata: Metadata = {
  title: "Departments | E-Procurement",
  description: "Organization department page",
  keywords: "departments, organization, procurement, e-procurement",
};

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/departments");
  }
  const response = await actionRequest({
    method: "get",
    url: "/organization/departments/",
  });

  if (!response.success) return <Page404 error={response} />;

  const departments: Array<Department> = response.data;
  const permissions = response.auth_perms!;

  if (!departments.length) {
    return (
      <div className="p-20">
        <div className="p-8 w-max mx-auto flex flex-col gap-8 items-center bg-card text-card-foreground rounded-lg border">
          <h1 className="font-bold text-xl sm:text-2xl text-center">
            Your Organization Has No Department
          </h1>
          {permissions.create && (
            <div className="flex items-center flex-1 justify-end">
              <AddDepartment />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <ClientSitePage
        page={{
          title: "Departments",
        }}
      />
      <div className="section-heading">
        <div className="relative">
          <Input
            className="md:w-[300px] pr-4"
            placeholder="Search by name or head"
          />
          <Button
            variant="secondary"
            size={"icon"}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
        {permissions.create && (
          <div className="grid">
            <AddDepartment text={"Add Department"} />
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="table-wrapper">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <small>#</small>
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Units</th>
                <th>Department Head</th>
                <th>Phone Number</th>
                <th>Status</th>
                {!!(permissions.delete || permissions.create) && (
                  <th className="w-[10ch]">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {departments.map((department, index) => {
                return (
                  <tr key={department.id}>
                    <td>
                      <small>{index + 1}</small>
                    </td>
                    <td>
                      <Link
                        href={`/organization/departments/${department.id}`}
                        className="link transition underline-offset-4 hover:underline"
                      >
                        {generate_unique_id("", department.id)}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/organization/departments/${department.id}`}
                        className="transition underline-offset-4 hover:underline"
                      >
                        {department.name}
                      </Link>
                    </td>
                    <td>
                      <span className="pl-4">{department.units.length}</span>
                    </td>

                    <th>
                      {department.department_head ? (
                        <Link
                          href={`/organization/staffs/${department.department_head.id}`}
                          className="transition underline-offset-4 hover:underline"
                        >
                          {department.department_head.name}
                        </Link>
                      ) : (
                        <span className="pl-6">-</span>
                      )}
                    </th>
                    <td>{department.phone || "-"}</td>
                    <td
                      className={`font-semibold ${
                        department.disabled
                          ? "text-destructive"
                          : "text-green-500"
                      }`}
                    >
                      {department.disabled ? "Disable" : "Active"}
                    </td>
                    {!!(permissions.delete || permissions.create) && (
                      <td>
                        <span className="inline-flex items-center gap-1">
                          {permissions.update && (
                            <AddDepartment department={department}>
                              <Button size={"sm"} variant={"secondary"}>
                                Update
                              </Button>
                            </AddDepartment>
                          )}

                          {/* TODO: make user cannot update or disabled there own department */}
                          {permissions.delete && (
                            <>
                              {!department.disabled && (
                                <DisableDepartment department={department} />
                              )}
                            </>
                          )}
                          {permissions.update && (
                            <>
                              {department.disabled && (
                                <EnableDepartment department={department} />
                              )}
                            </>
                          )}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
