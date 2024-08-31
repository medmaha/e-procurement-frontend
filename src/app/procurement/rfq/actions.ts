"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function retrieveRFQ(slug: ID) {
	return actionRequest<RFQ>({
		method: "get",
		url: "/procurement/rfq/" + slug + "/?only=items",
	});
}
export async function createRFQ(data: Json, pathname: string) {
	const suppliers = (data.suppliers as string)?.valueOf().toString().split(",");
	data["suppliers"] = suppliers;

	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/procurement/rfq/create/",
	});
}
export async function updateRFQ(data: Json, pathname: string) {
	const suppliers = (data.suppliers as string)?.valueOf().toString().split(",");
	data["suppliers"] = suppliers;

	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/rfq/update/",
	});
}
export async function approveRFQ(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/procurement/rfq/approve/",
	});
}
export async function publishRFQ(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/rfq/publish/",
	});
}
