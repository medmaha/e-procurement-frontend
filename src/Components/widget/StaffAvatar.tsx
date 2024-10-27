import { cn } from "@/lib/ui/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

type Props = {
  staff?: {
    id: ID;
    name: string;
    avatar?: string;
    job_title?: string;
  };
  noLink?: boolean;
  className?: string;
};

export default function StaffAvatar({ staff, ...props }: Props) {
  if (!staff) return "N/A";
  return (
    <Link
      href={
        props.noLink || !staff.id ? "#" : `/organization/staffs/${staff.id}`
      }
      className="inline-flex items-center gap-1"
    >
      <Avatar className={cn("w-8 h-8", props.className)}>
        <AvatarImage src={staff.avatar} />
        <AvatarFallback>
          {staff.name?.charAt(0) || (
            <span className="text-sm font-semibold text-muted-foreground">
              No Staff
            </span>
          )}
        </AvatarFallback>
      </Avatar>
      <div className="inline-grid h-max text-sm">
        <span
          title={staff.name || "No-Name"}
          className="inline-block truncate max-w-[20ch]"
        >
          {staff.name || "No-Name"}
        </span>
        <small
          title={staff.job_title}
          className="inline-block leading-none text-muted-foreground max-w-[18ch]"
        >
          {staff.job_title || "no-job-title"}
        </small>
      </div>
    </Link>
  );
}
