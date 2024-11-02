import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import Container from "./Container";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export const metadata: Metadata = {
  title: "Requisitions | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/account/login?next=/procurement/requisitions");
  }

  return (
    <section className="section">
      <ClientSitePage
        page={{
          title:"Requisitions"
        }}
      />
      <Container user={user} />
    </section>
  );
}
