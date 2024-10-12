import "./globals.css";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import APP_COMPANY from "@/APP_COMPANY";
import TopNavigationBar from "@/Components/Navbar/Index";
import ClientLayout from "../Components/ClientLayout";

import type { Metadata } from "next";
import { validateAndDecodeJWT } from "@/lib/auth/generics";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/auth/constants";
import { lazy, Suspense } from "react";
const inter = Poppins({ weight: "400", preload: true, subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Procurement",
  description: "E-procurement site offered by " + APP_COMPANY.provider.name,
};

const AsideNavigation = lazy(
  () => import("@/Components/Navbar/AsideNavigation")
);

export default function RootLayout({ children }: any) {
  const session = getAuthUser();
  const theme = cookies().get("theme")?.value ?? "light";
  return (
    <html lang="en" className={theme + " transition-[background-color,color]"}>
      <body
        className={`${inter.className} transition-[background-color,color]`}
      >
        {/* <body className={"transition-[background-color,color]"}> */}
        <ClientLayout theme={theme} session={session}>
          {session ? (
            <div className={`grid ${session ? "grid-cols-[auto,1fr]" : ""}`}>
              {session && (
                <Suspense fallback={<div className="border-r h-full"></div>}>
                  <AsideNavigation user={session} />
                </Suspense>
              )}
              <div className="grid min-h-[100svh] grid-rows-[auto,1fr,auto]">
                <Header session={session} />

                <Main page={children} />
                <Footer />
              </div>
            </div>
          ) : (
            <div className="grid min-h-[100svh] grid-rows-[auto,1fr,auto]">
              <Header session={session} />
              <Main page={children} />
              <Footer />
            </div>
          )}
        </ClientLayout>
      </body>
    </html>
  );
}

function Header({ session }: any) {
  const theme = cookies().get("theme")?.value ?? "light";
  return <TopNavigationBar session={session} theme={theme} />;
}

function Main({ page }: any) {
  return (
    <main className="bg-background text-foreground relative w-full block overflow-x-hidden">
      {page}
    </main>
  );
}

function Footer() {
  const today = new Date();
  return (
    <footer className="p-4 mt-4 sm:px-6 bg-accent text-accent-foreground">
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
