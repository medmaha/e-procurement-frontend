"use server";

import { actionRequest } from '@/lib/utils/actionRequest';


export async function toggleActivation(
	pk: ID,
	active: boolean,
	pathname: string
) {
	return actionRequest({
		pathname,
		method: "put",
		data: { active, pk },
		url: "/vendors/registration/activation/",
	});
}
