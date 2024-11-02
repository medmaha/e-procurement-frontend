import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import Page404 from "@/app/not-found";
import { revert_unique_id } from "@/lib/helpers/generator";
import { actionRequest } from "@/lib/utils/actionRequest";
import NegotiateContract from "../Components/NegotiateContract";
import AwardContract from "../Components/AwardContract";
import GoBack from "@/Components/ui/GoBack";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Info } from "lucide-react";
import { returnTo } from "@/lib/server/urls";

type Extras = {
  contract: {
    id: string;
    status: string;
    officer: {
      id: ID;
      name: string;
    };
    approvable: boolean;
    terms_and_conditions: string;
  };
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo(
      "/account/login",
      `/procurement/rfq/contracts/create`,
      props.searchParams
    );
  }

  const model_id = Number(revert_unique_id(props.searchParams.m_id));
  const isNegotiation = props.searchParams.negotiation;

  if (!model_id || isNaN(model_id))
    return (
      <Page404
        error={{
          message: "Not Found! _--_ Invalid query parameters",
          status: 403,
        }}
      />
    );

  const response = await actionRequest<RFQResponse, Extras>({
    method: "get",
    url: `/procurement/rfq/responses/${model_id}/?for=contracts&negotiation=${isNegotiation}`,
  });

  if (!response.success) return <Page404 error={response} />;

  const quotation = response.data;
  const permissions = response.auth_perms;

  async function submitContract(data: FormData) {
    "use server";
    const response = await actionRequest({
      data,
      method: "post",
      url: "/procurement/rfq/contracts/create/",
    });
    if (response.success)
      return redirect("/procurement/rfq/contracts/" + response.id);

    const cookieMaxAge = new Date(Date.now() + 15 * 1000);
    cookies().set(
      "error",
      response.message || "Oops! an unknown error occurred",
      {
        expires: cookieMaxAge,
      }
    );
    revalidatePath("/procurement/rfq/contracts/create", "page");
    return new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(true), 300)
    );
  }
  async function submitNegotiation(data: FormData) {
    "use server";
    return submitContract(data);
  }

  const error_message = cookies().get("error")?.value;

  return (
    <section className="section">
      {error_message && (
        <div className="absolute top-8 shadow left-1/2 translate-x-[-50%] w-full text-destructive-foreground text-center max-w-[600px] p-2 mx-auto bg-destructive text-lg rounded-md ">
          <p className="inline-flex items-center text-sm gap-2">
            <Info size={16} />
            <span>{error_message} </span>
          </p>
        </div>
      )}
      {isNegotiation ? (
        <NegotiateContract
          user={user}
          quotation={quotation}
          submitNegotiation={submitNegotiation}
          permissions={permissions}
          contract={response.extras.contract}
        >
          <div className="grid items-start justify-start">
            <div className="pb-1">
              <GoBack />
            </div>
          </div>
        </NegotiateContract>
      ) : (
        <AwardContract
          user={user}
          contract={response.extras.contract}
          quotation={quotation}
          submitContract={submitContract}
          permissions={permissions}
        >
          <div className="grid items-start justify-start">
            <div className="pb-1">
              <GoBack />
            </div>
          </div>
        </AwardContract>
      )}
    </section>
  );
}
