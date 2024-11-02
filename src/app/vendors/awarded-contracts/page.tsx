
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { returnTo } from "@/lib/server/urls";
import { actionRequest } from "@/lib/utils/actionRequest";
import { redirect } from "next/navigation";
import PageContainer from "./PageContainer";
import PageError from "@/app/error";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", "/vendors/awarded-contracts");
  }

  if (!user.meta.vendor) {
    return redirect("/dashboard");
  }

  const response = await actionRequest<ContractAward[]>({
    method: "get",
    url: "/procurement/contracts/awards/",
  });

  if (!response.success) {
    return (
      <PageError
        error={{
          digest: response.message,
          message: response.message,
          name: "Page Error",
        }}
      />
    );
  }

  return (
    <section className="section">
      <PageContainer user={user} data={response.data} />
    </section>
  );
}
