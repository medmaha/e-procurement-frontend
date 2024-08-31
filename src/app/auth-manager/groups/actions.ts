"use server";

import { actionRequest } from '@/lib/utils/actionRequest';


export async function getAuthGroups() {
	const response = await actionRequest({
		method: "get",
		url: "/account/groups/",
	});
	return response;
}
export async function getPermissions() {
	const response = await actionRequest({
		method: "get",
		url: "/account/permissions/select/",
	});
	return response;
}

export async function createGroup(
	formData: FormData,
	pathname: string,
	isUpdate: boolean
) {
	const permissions = formData
		.get("permissions")
		?.valueOf()
		.toString()
		.split(",");
	const data = Object.fromEntries(formData.entries()) as any;

	if (data) data["permissions"] = permissions;

	const response = await actionRequest({
		data,
		pathname,
		method: isUpdate ? "put" : "post",
		url: "/account/groups" + (isUpdate ? "/update/" : "/create/"),
	});
	return response;
}
