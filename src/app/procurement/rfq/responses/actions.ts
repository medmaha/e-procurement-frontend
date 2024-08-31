"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function rejectRFQResponse(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/rfq/responses/reject/",
	});
}
