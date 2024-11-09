import React from "react";
import PageContainer from "./PageContainer";
import ClientSitePage from "@/Components/ui/ClientSitePage";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { returnTo } from "@/lib/server/urls";
import PageError from "@/app/error";

export default async function page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", "/procurement/contracts/awards");
  }

  const response = await actionRequest({
    url: "/procurement/contracts/",
    method: "get",
  });

  if (!response.success) {
    return (
      <PageError
        error={{
          digest: response.message,
          name: "Error",
          message: response.message,
        }}
        reset={async () => {
          "use server";
        }}
      />
    );
  }

  const permissions = response.auth_perms;

  return (
    <section className="section">
      <ClientSitePage
        page={{
          title: "Contract Drafts",
        }}
      />
      <PageContainer
        user={user}
        permissions={permissions}
        contracts={response.data}
      />
    </section>
  );
}
