"use server";

import { actionRequest } from "@/lib/utils/actionRequest";
import { revalidatePath } from "next/cache";

export async function submitForEvaluation(data: Json) {
	return actionRequest({
		data,
		method: "post",
		url: "/procurement/rfq/evaluation/create/",
	});
}
export async function deleteSubmittedEvaluation(data: Json) {
	return actionRequest({
		data,
		method: "delete",
		url: "/procurement/rfq/evaluation/remove/",
	});
}
export async function refreshPage(pathname: string) {
	revalidatePath(pathname, "page");
}
