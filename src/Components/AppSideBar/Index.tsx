"use client";

import APP_COMPANY from "@/APP_COMPANY";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/Components/ui/sidebar";

import { Avatar, AvatarImage } from "../ui/avatar";

import { AvatarFallback } from "@radix-ui/react-avatar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

import Link from "next/link";
import { StaffAccordions } from "./StaffSideNav";
import { VendorAccordions } from "./VendorSideNav";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo, useRef } from "react";

export function AppSidebar({ user }: any) {
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
        <SidebarGroup>
          <Accordions user={user} closeNav={() => {}} />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export function Accordions({ user, closeNav }: any) {
  const pathname = useSelectedLayoutSegments();

  const state = useMemo(() => {
    return getInitialState(pathname.join("/"), user);
  }, [pathname, user]);

  function getTabColor(tab: any) {
    if (tab.label === state.tab?.label) {
      return "link bg-secondary";
    }
    return "";
  }
  function getLinkColor(href: any) {
    if (href === state.link.href) {
      return "px-2 bg-secondary";
    }
    return "";
  }

  return (
    <Accordion
      type="single"
      // collapsible
      className="active-tap w-full"
      defaultValue={state.tab.label}
      collapsible
    >
      {getAccordions(user).map((accordion) => {
        return (
          <AccordionItem
            value={accordion.label}
            key={accordion.label}
            className="px-0"
          >
            <AccordionTrigger
              className={`${getTabColor(
                accordion
              )} font-semibold py-1.5 my-2 px-2 rounded-md`}
            >
              {accordion.label}
            </AccordionTrigger>
            <AccordionContent className="pt-0 mt-0 ml-4">
              {accordion.items.map((item) => {
                return (
                  <ul key={item.name} className="flex flex-col w-full">
                    <li className="inline-block mt-1 w-full">
                      <Link
                        onClick={(ev) => {
                          closeNav();
                        }}
                        href={item.href}
                        className={`${getLinkColor(item.href)} ${
                          item.name === "procurement_thresholds"
                            ? "text-sm"
                            : ""
                        } hover:text-primary/80 transition-all inline-block p-1 text-sm text w-full`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  </ul>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

type IAccordion = {
  label: string;
  items: Array<{
    label: string;
    name: string;
    href: string;
  }>;
};
type AccordionArray = Array<IAccordion>;

function getAccordions(user: AuthUser): AccordionArray {
  if (user.profile_type === "Vendor") return VendorAccordions;
  return StaffAccordions;
}

function getInitialState(segment: string | null, user: AuthUser) {
  let tab = {} as IAccordion;
  let link = {} as IAccordion["items"][0];

  let route = "/" + (segment || "");

  const matches = (item: IAccordion["items"][0]) => {
    if (item.href === route) {
      return true;
    }
    if (item.href.match(route)) {
      return true;
    }
    return false;
  };
  outerLoop: for (const accordion of getAccordions(user)) {
    innerLoop: for (const item of accordion.items) {
      if (matches(item)) {
        link = item;
        tab = accordion;
        break outerLoop;
      }
    }
  }
  return { link, tab };
}
