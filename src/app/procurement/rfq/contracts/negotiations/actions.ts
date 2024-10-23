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
		url: "/procurement/rfq/contracts/negotiations/?renegotiate=true",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
	});
}
