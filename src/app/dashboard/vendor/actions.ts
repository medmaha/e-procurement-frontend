"use server";

import { actionRequest } from '@/lib/utils/actionRequest';


export async function retrieveVendor() {
	return actionRequest<Vendor>({
		method: "get",
		url: "/vendors/retrieve/",
	});

}
