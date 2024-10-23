import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { searchParamsToSearchString } from "@/lib/server/urls";
import Container from "./Container";

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (user) {
    const next = props.searchParams.next;


    if (next) return redirect(next);
    const url =
      user.profile_type === "Vendor" ? "/dashboard/vendor" : "/dashboard";
    return redirect(url);
  }

  return (
    <section className="section">
      <Container />
    </section>
  );
}
