"use server";

import { actionRequest } from '@/lib/utils/actionRequest';


export async function updateMyContactInfo(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/vendors/contact-person/update/",
	});
}
