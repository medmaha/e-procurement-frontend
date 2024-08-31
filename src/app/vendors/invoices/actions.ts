"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function createInvoice(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/vendors/invoices/create/",
	});
}

export async function getQuotationResponse() {
	return actionRequest({
		method: "get",
		url: "/procurement/quotations/respond/select/",
	});
}
