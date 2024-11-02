"use client";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BriefcaseIcon, FileIcon, FolderGit, GitCompare } from "lucide-react";

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
      <Link href={"/dashboard"} className="text-sm">
        Dashboard
      </Link>
      <Link href={"#"} className="text-sm">
        Inventory
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm">
          Procurement
        </DropdownMenuTrigger>
        <DropdownMenuContent className="lg:w-[400px] md:w-[300px] min-h-[30svh]">
          <DropdownMenuLabel>Procurement Module</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="grid gap-2 pb-4">
            <Link href={"/procurement/single_sourcing"}>
              <DropdownMenuItem className="flex items-center gap-4 cursor-pointer">
                <BriefcaseIcon className="w-4 h-4" />
                Single Sourcing
              </DropdownMenuItem>
            </Link>
            <Link href={"/procurement/rfq"}>
              <DropdownMenuItem className="flex items-center gap-4 cursor-pointer">
                <GitCompare className="w-4 h-4" />
                Requests For Quotation
              </DropdownMenuItem>
            </Link>
            <Link href={"/procurement/lpo"}>
              <DropdownMenuItem className="flex items-center gap-4 cursor-pointer">
                <FileIcon className="w-4 h-4" />
                Local Purchase Orders
              </DropdownMenuItem>
            </Link>
            <Link href={"/procurement/contracts"}>
              <DropdownMenuItem className="flex items-center gap-4 cursor-pointer">
                <FolderGit className="w-4 h-4" />
                Contract Management
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
