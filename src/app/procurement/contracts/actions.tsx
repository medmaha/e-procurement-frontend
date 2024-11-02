"use server";

import { actionRequest } from "@/lib/utils/actionRequest";
import { revalidatePath } from "next/cache";

export async function createContractApproval(
  _id: string,
  data: FormData,
  path?: string
) {
  const response = await actionRequest<ContractApproval>({
    data,
    method: "post",
    url: `/procurement/rfq/contracts/${_id}/approval/`,
  });

  if (response.success && path) {
    revalidatePath(path, "page");
  }

  return response;
}
