import { Home } from "lucide-react";
import Link from "next/link";
import NotificationBell from "./Notification";
import ThemeSwitcher from "./ThemeSwitcher";
import UserAccount from "./UserAccount";
import HistorySwitcher from "./HistorySwitcher";
import Tooltip from "../ui/tooltip";
import NavLinks from "./NavLinks";
import SidebarCloser from "../AppSideBar/SidebarCloser";
import { SidebarTrigger } from "../ui/sidebar";

export default function TopNavigationBar({ session, theme }: any) {
  return (
    <nav className="flex justify-between items-center gap-4 text-card-foreground flex-1">
      <div className="">
        <div className="inline-block md:hidden">
          <SidebarTrigger />
        </div>
      </div>

      <div className="">
        <HistorySwitcher user={session} />
      </div>

      <div className="flex items-center gap-4">
        <ul className="md:flex items-center gap-6 hidden">
          {!session && (
            <>
              <li>
                <Tooltip content="Login">
                  <Link
                    href="/account/login"
                    className="text-foreground hover:text-primary font-semibold"
                  >
                    Login
                  </Link>
                </Tooltip>
              </li>
              <li>
                <Tooltip content="Register an account">
                  <Link
                    href="/account/signup"
                    className="text-primary-foreground bg-primary p-2 rounded-md font-semibold"
                  >
                    Register Now
                  </Link>
                </Tooltip>
              </li>
            </>
          )}
        </ul>

        {session && (
          <>
            <div className="">
              <Tooltip content="Dashboard">
                <Link
                  className="p-1 rounded hover:opacity-100 opacity-90"
                  href={`/dashboard${session.meta.vendor ? "/vendor" : ""}`}
                >
                  <Home />
                </Link>
              </Tooltip>
            </div>
            <div className="cursor-pointer">
              <NotificationBell />
            </div>
            <Tooltip content={theme === "dark" ? "Light Mode" : "Dark Mode"}>
              <ThemeSwitcher theme={theme} />
            </Tooltip>

            <div className="">
              <Tooltip content="Account">
                <UserAccount session={session} />
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
