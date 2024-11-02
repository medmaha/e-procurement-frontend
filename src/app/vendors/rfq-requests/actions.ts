"use server";

import { AxiosHeaders } from "axios";
import { actionRequest } from "@/lib/utils/actionRequest";

export async function submitRFQResponse(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
		url: "/vendors/rfq-responses/submit/",
	});
}
export async function retrieveQuotationRespond(quotation_id: string) {
	return actionRequest({
		method: "get",
		url: "/vendors/rfq-responses/retrieve/" + quotation_id,
	});
}
