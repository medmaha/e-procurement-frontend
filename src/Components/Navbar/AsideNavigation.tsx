"use client";

import { SidebarClose, SidebarOpen } from "lucide-react";
import Link from "next/link";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import APP_COMPANY from "@/APP_COMPANY";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { Button } from "../ui/button";
import { StaffAccordions } from "./StaffSideNav";
import { VendorAccordions } from "./VendorSideNav";
import { GPPAAccordions } from "./GPPASideNav";

type Props = {
  user: AuthUser;
};
export default function AsideNavigation({ user }: Props) {
  const [screenSize, setScreenSize] = useState(1025);

  useLayoutEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let SmallScreenSize = 1024;

  return (
    <>
      {/* {screenSize <= SmallScreenSize ? (
        <MiniNavbar user={user} />
      ) : (
        <aside className="bg-card text-card-foreground sticky top-0 h-[100dvh] w-full max-w-[60px] sm:max-w-[70px] lg:max-w-[300px]">
          <div className="lg:grid grid-rows-[auto,1fr,auto] hidden h-[100dvh] min-w-full">
            <NavContent user={user} />
          </div>
        </aside>
      )} */}
      <MiniNavbar user={user} />
    </>
  );
}

function MiniNavbar({ user }: any) {
  const miniRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSizeNav = useCallback(() => {
    const element = miniRef.current;

    if (element) {
      setIsOpen((p) => !p);
      element.classList.toggle("opened");
      element.classList.toggle("border-r");
      element.classList.toggle("translate-x-[-105%]");
      document.querySelector(".nav-brand")?.classList.toggle("opacity-0");
    }
  }, []);

  useEffect(() => {
    const handleOuterClick = (ev: any) => {
      const target = ev.target as HTMLElement;
      if (target === miniRef.current) return;
      if (target.classList.contains(".toggler")) return;
      if (target.closest("._mini-nav ")) return;
      toggleSizeNav();
    };
    if (isOpen) {
      document.addEventListener("pointerup", handleOuterClick);
    }
    return () => document.removeEventListener("pointerup", handleOuterClick);
  }, [isOpen, toggleSizeNav]);

  return (
    <>
      <div className="bg-card text-card-foreground h-[100dvh] sticky top-0 w-full max-w-[60px] sm:max-w-[70px] border-r flex justify-center pt-3">
        <div className="pt-3 px-2">
          <Button
            onClick={toggleSizeNav}
            variant={"ghost"}
            className="p-0 h-max toggler"
          >
            <SidebarOpen className="fill-secondary" />
          </Button>
        </div>
      </div>
      <div
        className="_mini-nav min-w-[270px] max-w-max fixed top-0 left-0 h-full z-50 bg-card border-r translate-x-[-105%] duration-300 grid grid-rows-[auto,1fr,auto]"
        ref={miniRef}
      >
        {isOpen && (
          <NavContent user={user} closeNav={toggleSizeNav}>
            {/* <Button
              onClick={toggleSizeNav}
              size={"sm"}
              variant={"ghost"}
              aria-label={"Close Navigation"}
              className="px-0 toggler h-max"
            >
              <SidebarClose />
            </Button> */}
          </NavContent>
        )}
      </div>
    </>
  );
}

function NavContent({ user, children, closeNav }: any) {
  return (
    <>
      <header className="h-[71px] min-w-full lg:w-[280px]">
        <div className="flex items-center gap-4 justify-between sm:justify-center h-full border-b border-r">
          <h2 className="text-xl flex items-center justify-center h-full  w-full px-4 font-bold pb-[2px]">
            <a
              href={`/dashboard${user.meta.vendor ? "/vendor" : ""}`}
              className="inline-block max-w-[20ch] truncate"
            >
              {APP_COMPANY.name}
            </a>
          </h2>
          {children && (
            <div className="flex sm:hidden justify-end ">{children}</div>
          )}
        </div>
      </header>

      <section className="border-r">
        {children && (
          <div className="sm:flex hidden justify-end pt-2.5 px-6">
            {children}
          </div>
        )}
        <div className={`${children ? "p-6 pt-2" : "p-6"}`}>
          <Accordions user={user} closeNav={closeNav} />
        </div>
      </section>
      <footer className="p-4 border-r sm:px-6 bg-accent text-accent-foreground">
        <div className="flex justify-center gap-6 flex-wrap items-center">
          <p className="text-xs text-muted-foreground">
            &copy;{" "}
            <a
              href={user.meta?.vendor?.website || APP_COMPANY.website}
              target="blank"
              className="font-semibold underline underline-offset-4 tracking-wide"
            >
              {user.meta?.vendor?.id
                ? user.meta?.vendor?.name
                : APP_COMPANY.name}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
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

export function Accordions({ user, closeNav }: any) {
  const pathname = useSelectedLayoutSegments();

  const state = useMemo(() => {
    return getInitialState(pathname.join("/"), user);
  }, [pathname, user]);

  const ref = useRef<HTMLDivElement>(null);

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
      ref={ref}
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
                  <ul
                    key={item.name}
                    className="flex flex-col space-y-1 w-full"
                  >
                    <li className="inline-block mt-2 w-full">
                      <Link
                        onClick={(ev) => {
                          const target = ev.target as HTMLElement;

                          if (target.closest("._mini-nav.opened")) {
                            closeNav();
                          }
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
  if (user.profile_type === "GPPA") return GPPAAccordions;
  return StaffAccordions;
}
