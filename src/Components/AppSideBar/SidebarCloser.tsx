"use client";
import React from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { SidebarClose } from "lucide-react";

export default function SidebarCloser({ noCheck }: any) {
  const { state, toggleSidebar } = useSidebar();
  if (!noCheck && state === "collapsed") return null;

  return (
    <button
      onClick={toggleSidebar}
      className="inline-flex  items-center justify-center rounded-md h-8 w-8 transition-all hover:bg-accent/80"
    >
      <SidebarClose className="w-4 h-4 lg:w-5 lg:h-5" />
    </button>
  );
}
