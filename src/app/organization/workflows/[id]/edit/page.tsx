import { getAuthenticatedUser } from "@/lib/auth/generics";
import { redirect } from "next/navigation";
import React from "react";
import EditContainer from "./EditContainer";

export default async function WorkflowDetailPage({ params }: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/workflows");
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <EditContainer user={user} workflow_id={params.id} />
    </section>
  );
}
