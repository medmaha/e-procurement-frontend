"use client";
import React from "react";
import AddOrEditRequisition from "./Components/AddOrEditRequisition";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { LayoutGridIcon, SearchIcon, SheetIcon } from "lucide-react";

type Props = {
  user: AuthUser;
  gridView: boolean;
  setGridView: (value: boolean) => void;
  permissions: AuthPerm;
};

export default function Header({ user, permissions, ...props }: Props) {
  return (
    <div className="section-heading">
      <div className="relative">
        <Input
          className="md:w-[300px] pr-4"
          placeholder="Search by officer or id"
        />
        <Button
          variant="secondary"
          size={"icon"}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-1">
          <Button
            size={"icon"}
            className="rounded-lg"
            variant={props.gridView ? "secondary" : "outline"}
            onClick={() => props.setGridView(true)}
          >
            <LayoutGridIcon className="h-4 w-4" />
          </Button>
          <Button
            size={"icon"}
            className="rounded-lg"
            onClick={() => props.setGridView(false)}
            variant={!props.gridView ? "secondary" : "outline"}
          >
            <SheetIcon className="h-4 w-4" />
          </Button>
        </div>
        {permissions.create && (
          <AddOrEditRequisition user={user}>
            <Button className="">+ New Requisition</Button>
          </AddOrEditRequisition>
        )}
      </div>
    </div>
  );
}
