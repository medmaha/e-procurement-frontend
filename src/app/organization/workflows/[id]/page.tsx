import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { redirect } from "next/navigation";
import React from "react";
import WorkflowDetail from "../components/WorkflowDetail";

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/organization/workflows");
  }

  const response = await actionRequest<WorkflowInterface>({
    method: "get",
    url: `/procurement/workflows/${params.id}/`,
  });

//   if (!response.success) {
//     return <ErrorDisplay error={response.error} />;
//   }

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

  if (!response.data) {
    // return <LoadingSpinner />;
    return (
        // <Container workflows={response.data} />
        <section className="section">
          <pre>
            Error: &nbsp;
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </section>
      );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <WorkflowDetail workflow={response.data} />
    </section>
  );
}
