import { Check, Info, SearchIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddStaff from "./Components/AddStaff";
import DisableStaff from "./Components/DisableStaff";
import EnableStaff from "./Components/EnableStaff";
import { generate_unique_id } from "@/lib/helpers/generator";
import { Input } from "@/Components/ui/input";
import { SelectMultiple } from "@/Components/ui/select-multiple";
import MultipleSelectBox from "@/Components/ui/multi-select";

export const metadata: Metadata = {
  title: "Staffs | E-Procurement",
  description: "Organization staff page",
  keywords: "staffs, organization, procurement, e-procurement",
};

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return redirect("/account/login?next=/organization/staffs");
  }

  const response = await actionRequest<Staff[]>({
    method: "get",
    url: "/organization/staffs/",
  });

  if (!response.success) {
    return <Page404 error={response} />;
  }

  const staffs = response.data;
  const permissions = response.auth_perms;

  if (!staffs || !staffs.length) {
    return (
      <div className="p-20">
        <div className="p-8 w-max mx-auto flex flex-col gap-8 items-center bg-card text-card-foreground rounded-lg border">
          <h1 className="font-bold text-xl sm:text-2xl text-center">
            Your Organization Has No Staff
          </h1>
          <div className="flex items-center flex-1 justify-end">
            <AddStaff user={user} autoOpen={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div className="relative">
          <Input
            className="md:w-[300px] pr-4"
            placeholder="Search by staff name or unit"
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
          <div className="grid items-center">
            <AddStaff text={"Add Staff"} user={user} autoOpen={false} />
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
                <th>Full Name</th>
                <th>Job Title</th>
                <th>Unit</th>
                <th>Department</th>
                <th>Status</th>
                {!!(permissions.delete || permissions.create) && (
                  <th className="w-[10ch]">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {staffs.map((staff, index) => {
                return (
                  <tr key={staff.id}>
                    <td>
                      <small>{index + 1}</small>
                    </td>
                    <td>
                      <Link
                        href={`/organization/staffs/${staff.id}`}
                        className="link transition underline-offset-4 hover:underline"
                      >
                        {generate_unique_id("EM", staff.id)}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/organization/staffs/${staff.id}`}
                        className="transition underline-offset-4 hover:underline"
                      >
                        {staff.name}
                      </Link>
                    </td>
                    <td>{staff.job_title || "-"}</td>

                    <td>
                      <Link
                        href={`/organization/units/${staff.unit.id}`}
                        className="transition underline-offset-4 hover:underline"
                      >
                        {staff.unit.name || "-"}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/organization/departments/${staff.unit.department.id}`}
                        className="transition underline-offset-4 hover:underline"
                      >
                        {staff.unit.department.name || "-"}
                      </Link>
                    </td>
                    <td
                      className={` ${
                        staff.disabled ? "text-destructive" : "text-green-500"
                      }`}
                    >
                      {staff.disabled ? "Disable" : "Active"}
                    </td>
                    {!!(permissions.delete || permissions.create) && (
                      <td>
                        <span className="inline-flex justify-center items-center gap-1">
                          {permissions.update && (
                            <AddStaff user={user} staff={staff}>
                              <Button
                                size={"sm"}
                                variant={"secondary"}
                                className="text-sm"
                              >
                                Update
                              </Button>
                            </AddStaff>
                          )}

                          {staff.id !== user.profile_id && (
                            <>
                              {!staff.disabled && (
                                <DisableStaff staff={staff} />
                              )}
                              {staff.disabled && <EnableStaff staff={staff} />}
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
