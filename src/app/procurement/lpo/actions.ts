"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function createPurchaseOrder(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/procurement/purchase-orders/create/",
	});
}
export async function retrievePurchaseOrder(order_id: ID) {
	return actionRequest({
		method: "get",
		url: "/procurement/purchase-orders/retrieve/" + order_id + "/",
	});
}

export async function rejectPurchaseOrder(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/purchase-orders/reject/",
	});
}
export async function approvePurchaseOrder(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/purchase-orders/approve/",
	});
}
export async function getQuotationResponse() {
	return actionRequest({
		method: "get",
		url: "/procurement/quotations/respond/select/",
	});
}
