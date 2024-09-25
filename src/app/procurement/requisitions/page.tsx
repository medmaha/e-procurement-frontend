import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import Container from "./Container";

export const metadata: Metadata = {
  title: "Requisitions | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/account/login?next=/procurement/requisitions");
  }

  const response = await actionRequest<Requisition[]>({
    method: "get",
    url: "/procurement/requisitions/",
  });

  if (!response.success) {
    return <p>{response.message}</p>;
  }

  const requisitions = response.data;
  const permissions = response.auth_perms;

  return (
    <section className="section">
      <Container
        user={user}
        permissions={permissions}
        requisitions={requisitions}
      />
    </section>
  );
}
