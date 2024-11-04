import { returnTo } from "@/lib/server/urls";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import ViewContainer from "./ViewContainer";
import PageError from "@/app/error";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export default async function page({ params }: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", "/procurement/contracts/drafts/create");
  }

  if (user.meta.vendor) {
    returnTo("/dashboard");
  }

  const response = await actionRequest({
    url: `/procurement/contracts/${params.id}/`,
    method: "get",
  });

  if (!response.success) {
    return (
      <PageError
        error={{
          name: "Error",
          message: response.message,
        }}
      />
    );
  }

  async function updateContract(contract_id:ID, data: any) {
    "use server";
    console.log(data)
    throw new Error("Failed to update contract")
    const response = await actionRequest({
      url: `/procurement/contracts/${contract_id}/`,
      method: "put",
      data,
    });
    return response;
  }

  return (
    <section className="section">
      <ClientSitePage
        page={{
          title:"Contract Details"
        }}
      />
      
        <ViewContainer user={user} data={response.data} updateContract={updateContract}/>
    </section>
  );
}
