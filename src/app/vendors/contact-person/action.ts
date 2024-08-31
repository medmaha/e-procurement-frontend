"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function updateMyContactInfo(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/vendors/contact-person/update/",
	});
}
export async function getVerificationCode() {
	return actionRequest({
		method: "get",
		url: "/vendors/contact-person/verify/",
	});
}
export async function sendVerificationCode(data: Json, pathname?: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/vendors/contact-person/verify/",
	});
}
