"use server";

import { actionRequest } from "@/lib/utils/actionRequest";
import { AxiosHeaders } from "axios";

export async function renegotiateContract(data: FormData, pathname: string) {
	const file = data.get("file")!.valueOf() as File;
	if (file) {
		if (file.size < 10) data.delete("file");
		else if (file.name === "undefined") data.delete("file");
		else if (file.type === "application/octet-stream") data.delete("file");
	}
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/vendors/contracts/negotiations/",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
	});
}
export async function acceptContract(data: FormData, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/vendors/contracts/negotiations/",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
	});
}
