import "./globals.css";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import APP_COMPANY from "@/APP_COMPANY";
import TopNavigationBar from "@/Components/Navbar/Index";
import ClientLayout from "../Components/ClientLayout";
import { SidebarProvider } from "@/Components/ui/sidebar";

import type { Metadata } from "next";
import { validateAndDecodeJWT } from "@/lib/auth/generics";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/auth/constants";
import { AppSidebar } from "@/Components/AppSideBar/Index";
import { Toaster } from "@/Components/ui/sonner";
import SidebarCloser from "@/Components/AppSideBar/SidebarCloser";
const inter = Poppins({ weight: "400", preload: true, subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Procurement",
  description: "E-procurement site offered by " + APP_COMPANY.provider.name,
};

export default function RootLayout({ children }: any) {
  const session = getAuthUser();
  const theme = cookies().get("theme")?.value ?? "light";

  const defaultOpen = cookies().get("sidebar:state")?.value === "true";

  return (
    <html lang="en" className={theme + " transition-[background-color,color]"}>
      <body
        className={`${inter.className} transition-[background-color,color]`}
      >
        {/* <body className={"transition-[background-color,color]"}> */}
        <ClientLayout theme={theme} session={session}>
            <SidebarProvider defaultOpen={defaultOpen}>
              {session ? (
                  <AppSidebar user={session} />
                  <Main session={session}>{children}</Main>
              ) : (
                <>
                  <Main session={session}>{children}</Main>
                </>
              )}
            </SidebarProvider>
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}

function Header({ session }: any) {
  const theme = cookies().get("theme")?.value ?? "light";
  return (
    <header className="flex gap-4 h-[60px] md:px-6 px-2 sm:px-4 items-center sticky border-b top-0 z-10 bg-card bg-opacity-50 backdrop-blur-[3px]">
      <SidebarCloser />
      <TopNavigationBar session={session} theme={theme} />
    </header>
  );
}

function Main({ session, children }: any) {
  return (
    <div className="w-full">
      <Header session={session} />
      <main className="bg-background text-foreground relative min-h-[calc(100svh-60px-48px)] w-full block overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const today = new Date();
  return (
    <footer className="p-4 sm:px-6 bg-accent text-accent-foreground">
      <div className="flex justify-between gap-6 flex-wrap items-center">
        <p className="text-xs text-muted-foreground flex-1 text-center">
          Copyright &copy;{" " + today.getFullYear() + " "}
          <a
            target="blank"
            href={APP_COMPANY.provider.website}
            className="font-semibold underline underline-offset-4"
          >
            {APP_COMPANY.provider.name}
          </a>
        </p>
        <p className="text-xs text-muted-foreground md:inline-block hidden ">
          Offered to{" "}
          <a
            target="_blank"
            href={APP_COMPANY.website}
            className="font-semibold underline underline-offset-4"
          >
            {APP_COMPANY.name}
          </a>
        </p>
      </div>
    </footer>
  );
}

function getAuthUser() {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const user = validateAndDecodeJWT(accessToken)?.user || null;
  return user;
}
