import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { redirect } from "next/navigation";
import React from "react";
import CreateContainer from "./CreateContainer";

export default async function page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/workflows");
  }

  return (
    <section className="section">
      <CreateContainer user={user} />
    </section>
  );
}
