import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { redirect } from "next/navigation";
import React from "react";
import PageContainer from "./PageContainer";

export default async function page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/workflows");
  }

  return (
    <section className="section">
      <PageContainer user={user}/>
    </section>
  );
}
