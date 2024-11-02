import { getAuthenticatedUser } from "@/lib/auth/generics";
import PageContainer from "./PageContainer";
import { returnTo } from "@/lib/server/urls";
import React from "react";
import { actionRequest } from "@/lib/utils/actionRequest";
import PageError from "@/app/error";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", "/procurement/contracts/awards");
  }

  const response = await actionRequest({
    url: "/procurement/contracts/awards/",
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

  const permissions = response.auth_perms

  return (
    <section className="section">
      <ClientSitePage
        page={{
          title: "Contract Awards",
          description: "View all contract awards",
        }}
      />
      <PageContainer data={response.data} permissions={permissions} user={user}/>
    </section>
  );
}
