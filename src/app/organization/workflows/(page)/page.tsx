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
  const response = await actionRequest({
    method: "get",
    url: "/procurement/requisitions/workflows/",
  });

  if (!response.success)
    return (
      // <Container workflows={response.data} />
      <section className="section">
        <pre>
          Error: &nbsp;
          <code>{JSON.stringify(response, null, 2)}</code>
        </pre>
      </section>
    );

  return (
    <section className="section">
      <PageContainer user={user} workflows={response.data} />
    </section>
  );
}
