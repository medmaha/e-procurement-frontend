import APP_COMPANY from "@/APP_COMPANY";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/Components/ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="h-16 bg-sidebar-accent/30 rounded-md flex items-center px-1 gap-2">
          <div className="">
            <Avatar className="rounded-lg bg-sidebar-accent/80 flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11">
              <AvatarImage
                src={APP_COMPANY.logo}
                alt={APP_COMPANY.name}
                width={100}
                height={100}
                className=""
              />
              <AvatarFallback>
                {APP_COMPANY.name.split(" ")[0]?.charAt(0)}
                {APP_COMPANY.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="overflow-clip h-max">
            <p className="max-w-[17ch] truncate text-sm">{APP_COMPANY.name}</p>
            <p className="text-muted-foreground truncate max-w-[17ch]">
              <small>{APP_COMPANY.industry}</small>
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
