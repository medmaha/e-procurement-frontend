import { Metadata } from "next";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import StaffTable from "./Components/StaffTable";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Staffs | E-Procurement",
  description: "Organization staff page",
  keywords: "staffs, organization, procurement, e-procurement",
};

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return redirect("/account/login?next=/organization/staffs");
  }

  return (
    <section className="section">
      <StaffTable user={user} />
    </section>
  );
}
