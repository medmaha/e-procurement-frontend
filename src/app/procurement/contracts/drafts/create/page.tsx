import { returnTo } from "@/lib/server/urls";
import CreateContainer from "./CreateContainer";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";

export default async function page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", "/procurement/contracts/drafts/create");
  }

  if (user.meta.vendor) {
    returnTo("/dashboard");
  }

  async function handleCreateContract(data: any) {
    "use server";

    const response = await actionRequest({
      url: "/procurement/contracts/",
      method: "post",
      data,
    });
    return response;
  }
  return (
    <section className="section">
      <CreateContainer
        user={user}
        handleCreateContract={handleCreateContract}
      />
    </section>
  );
}
