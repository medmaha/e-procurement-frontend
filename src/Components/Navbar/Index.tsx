import { Home } from "lucide-react";
import Link from "next/link";
import APP_COMPANY from "@/APP_COMPANY";
import { Input } from "@/Components/ui/input";
import NotificationBell from "./Notification";
import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";
import UserAccount from "./UserAccount";
import HistorySwitcher from "./HistorySwitcher";
import Tooltip from "../ui/tooltip";

export default function TopNavigationBar({ session, theme }: any) {
  return (
    <header className="sticky border-b top-0 z-10 bg-card bg-opacity-50 backdrop-blur-[3px]">
      <nav className="flex justify-between items-center gap-5 h-[70px] text-card-foreground px-4 md:container">
        <div className="hidden md:block">
          <HistorySwitcher user={session} />
        </div>
        {session && <SearchBar user={session} />}

        <div className="flex items-center gap-4 flex-1 justify-end">
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
    </header>
  );
}
