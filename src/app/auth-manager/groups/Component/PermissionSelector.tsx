import React, { useEffect, useState } from "react";
import { Label } from "@/Components/ui/label";
import { getPermissions } from "../actions";
import { Permission } from "../types";
import MultipleSelectBox from "@/Components/ui/multi-select";

type Props = {
  perms?: Permission[];
};

type Selection = {
  title: string;
  value: string;
};

export default function PermissionSelector({ perms }: Props) {
  const [permissions, setPermissions] = useState([] as Selection[]);

  // Gets the permissions from the server
  useEffect(() => {
    const fetchData = async () => {
      const response = await getPermissions();

      if (response.success) {
        const _g = response.data?.reduce(
          (acc: Selection[], current: Permission) => {
            acc.push({
              title: cleanText(current.name),
              value: current.id.toString(),
            });
            return acc;
          },
          []
        );
        setPermissions(_g ?? []);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid gap-2 h-max max-h-[40svh] p-1 overflow-hidden overflow-y-auto">
      <Label>Select Permissions</Label>
      <div className="pr-1">
        <MultipleSelectBox
          inputPlaceholder="Search for permissions"
          name="permissions"
          defaultValues={perms?.map((p) => ({
            title: cleanText(p.name),
            value: p.id.toString(),
          }))}
          options={permissions}
        />
      </div>
    </div>
  );
}

function cleanText(text: string) {
  text = text.replace(/can/i, " ");
  text = text.replace("_", " ");
  text = text.replace("add", "Create |");
  text = text.replace("view", "Read |");
  text = text.replace("change", "Update |");
  text = text.replace("delete", "Disable |");
  return text;
}
