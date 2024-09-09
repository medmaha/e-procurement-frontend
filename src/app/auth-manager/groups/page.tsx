import { format } from "date-fns";
import { Check, Info } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/Components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { getAuthGroups } from "./actions";
import AddOrEditGroup from "./Component/AddGroup";

import type { Group } from "./types";
export const metadata: Metadata = {
  title: "Auth Groups | E-Procurement",
  description: "Organization auth groups page",
  keywords:
    "authentication, authorization, groups, organization, procurement, e-procurement",
};

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?");
  }
  const response = await actionRequest<Group[]>({
    method: "get",
    url: "/account/groups/",
  });
  if (!response.success) {
    return (
      <div className="p-8">
        <pre>
          <code>{JSON.stringify(response, null, 4)}</code>
        </pre>
      </div>
    );
  }
  const groups = response.data;
  const permissions = response.auth_perms;

  function groupEditableByStatus(status: boolean) {
    return groups?.filter((requisition) => requisition?.editable === status);
  }

  const editableGroups = groupEditableByStatus(true);
  const nonEditableGroups = groupEditableByStatus(false);

  return (
    <section className="p-6">
      <div className="p-6 rounded-lg shadow border dark:border-none bg-card text-card-foreground">
        <div className="flex justify-between">
          <div className="grid">
            <h1 className="text-xl sm:text-3xl font-bold">
              Authorization Groups
            </h1>
            <div className="grid px-2 pt-2 gap-1">
              {editableGroups.length > 0 && (
                <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Check size={"16"} className="text-primary" />
                    <span className="text-xs">
                      <span className="font-bold">{editableGroups.length}</span>{" "}
                      Editable {pluralize("Group", editableGroups.length)}
                    </span>
                  </span>
                </p>
              )}
              {nonEditableGroups.length > 0 && (
                <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Info size={"16"} className="text-destructive" />
                    <span className="text-xs">
                      <span className="font-bold">
                        {nonEditableGroups.length}
                      </span>{" "}
                      <span className=" min-w-[20ch]">
                        Non Editable{" "}
                        {pluralize("Group", nonEditableGroups.length)}
                      </span>
                    </span>
                  </span>
                </p>
              )}
            </div>
          </div>
          {/* {permissions.create && ( */}

          {/* TODO: Fix this mess */}
          {user.meta.id.toString() == "2" &&
            user.profile_id.toString() == "1" && (
              <div className="grid items-center">
                <AddOrEditGroup user={user}>
                  <Button className="font-semibold text-lg">+ New Group</Button>
                </AddOrEditGroup>
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {groups.map((group) => (
          <GroupDetail
            user={user}
            key={group.id}
            group={group}
            permissions={permissions}
          />
        ))}
      </div>
    </section>
  );
}

type Props = {
  permissions: AuthPerm;
  group: Group;
  user: AuthUser;
};

const GroupDetail = ({ group, user, permissions }: Props) => {
  return (
    <div className="bg-card text-card-foreground rounded border shadow p-6">
      <div className="">
        <h2 className="text-2xl font-bold">{group.name}</h2>
        <p className="line-clamp-2 pb-4">
          {group.description || "No description provided."}{" "}
        </p>
      </div>

      <div className="grid self-stretch grid-rows-[1fr,auto] items-center w-full">
        <div className="grid h-full">
          <h3 className="text-lg font-semibold">Permissions:</h3>
          <ul className="capitalize flex flex-wrap mt-1 gap-2">
            {group.permissions.map((permission, index) => (
              <li
                key={index}
                className="text-xs bg-accent text-accent-foreground rounded-full shadow p-1 px-2"
              >
                {" "}
                {cleanText(permission.name)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="text-sm">
            <div className="flex gap-4 pt-4">
              <p>Authored by:</p>
              <p className="font-semibold">{group.authored_by}</p>
            </div>
            <div className="flex  items-center gap-4">
              <p>Last Modified:</p>
              <p className="font-semibold text-xs">
                {format(new Date(group.last_modified), "PPPp")}
              </p>
            </div>
          </div>
          {group.editable && permissions.update && (
            <div className="">
              <AddOrEditGroup user={user} group={group}>
                <Button className="font-semibold w-full h-[30px]">
                  Update
                </Button>
              </AddOrEditGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function cleanText(text: string) {
  text = text.replace(/can/i, " ");
  text = text.replace("_", " ");
  // text = text.replace("add", "create");
  text = text.replace("change", "update");
  text = text.replace("delete", "disable");
  return text;
}

function pluralize(text: string, item_count: number) {
  return text + (item_count > 1 ? "s" : "");
}
