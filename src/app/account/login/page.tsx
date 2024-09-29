import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import Form from "./Form";
import { searchParamsToSearchString } from "@/lib/server/urls";

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (user) {
    const next = props.searchParams.next;

    console.log(next);
    console.log(searchParamsToSearchString(props.searchParams));

    if (next) return redirect(next);
    const url =
      user.profile_type === "Vendor" ? "/dashboard/vendor" : "/dashboard";
    return redirect(url);
  }

  const demoAccounts = [
    {
      email: "admin@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "staff@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "unit@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "department@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "procurement@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "finance@mail.com",
      password: "prc@2k2*",
    },
    {
      email: "account@unionlend.com",
      password: "prc@2k2*",
      vendor: true,
    },
    {
      email: "account@fundsflow.com",
      password: "prc@2k2*",
      vendor: true,
    },
  ];

  return (
    <section className="section">
      <div className="pt-20 grid gap-5 lg:grid-cols-[auto_1fr]" id="login">
        <div className="flex flex-col items-center justify-center p-4">
          <h3 className="">
            For demo purposes, you may try the accounts listed below
          </h3>

          <table className="w-full mt-6 border">
            <thead className="border-b bg-accent">
              <tr className="text-xs divide-x-">
                <th className="p-[5px] text-left font-semibold">Email</th>
                <th className="p-[5px] text-left font-semibold min-w-[100px]">
                  Password
                </th>
                <th className="p-[5px] text-left font-semibold min-w-[100px]">
                  Profile Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {demoAccounts.map((demo) => (
                <tr key={demo.email} className="text-xs divide-x">
                  <td className="p-[5px]">{demo.email}</td>
                  <td className="p-[5px]">{demo.password}</td>
                  <td className="p-[5px]">
                    {demo.vendor ? "Vendor" : "Staff"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block w-full max-w-[600px] sm:p-6 p-4 mx-auto bg-card text-card-foreground shadow rounded-md border-2">
          <div className="text-center pb-6">
            <h2 className="font-bold text-2xl">E-Procurement Portal</h2>
            <p className="text-sm">
              Welcome back! Sign in using your credentials
            </p>
          </div>

          <Form />
        </div>
        <div className="pt-8">
          <p className="text-center text-sm">
            Don&apos;t have an account yet?
            <Link
              href="/account/signup"
              className="px-2  font-bold transition hover:underline link underline-offset-4"
            >
              Signup now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
