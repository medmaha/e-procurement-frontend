import { Home } from "lucide-react";
import Link from "next/link";
import APP_COMPANY from "@/APP_COMPANY";
import { Input } from "@/Components/ui/input";
import NotificationBell from "./Notification";
import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";
import UserAccount from "./UserAccount";

export default function TopNavigationBar({ session, theme }: any) {
	return (
		<header className="sticky border-b top-0 z-10 bg-card bg-opacity-50 backdrop-blur-[3px]">
			<nav className="flex justify-between items-center gap-5 h-[70px] text-card-foreground px-4 md:container">
				<div
					className={`items-center hidden sm:flex ${
						session ? "lg:hidden" : ""
					}`}
				>
					<h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wider w-max pr-2 nav-brand duration-100">
						<a href="/">{APP_COMPANY.name}</a>
					</h2>
				</div>
				{session && <SearchBar user={session} />}

				<div className="flex items-center gap-4 flex-1 justify-end">
					<ul className="md:flex items-center gap-6 hidden">
						{!session && (
							<>
								<li>
									<Link
										href="/account/login"
										className="text-foreground hover:text-primary font-semibold"
									>
										Login
									</Link>
								</li>
								<li>
									<Link
										href="/account/signup"
										className="text-primary-foreground bg-primary p-2 rounded-md font-semibold"
									>
										Signup
									</Link>
								</li>
							</>
						)}
					</ul>

					{session && (
						<>
							<div className="">
								<Link
									className="p-1 rounded hover:opacity-100 opacity-90"
									href={`/dashboard${session.meta.vendor ? "/vendor" : ""}`}
								>
									<Home />
								</Link>
							</div>
							<div className="">
								<NotificationBell />
							</div>
							<ThemeSwitcher theme={theme} />

							<div className="">
								<UserAccount session={session} />
							</div>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
