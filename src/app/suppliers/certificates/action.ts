"use server";

import { AxiosHeaders } from 'axios';
import { actionRequest } from '@/lib/utils/actionRequest';


export async function createCertificates(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "post",
		url: "/vendors/certificates/create/",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
	});
}
export async function updateCertificates(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/vendors/certificates/update/",
		headers: new AxiosHeaders({ "Content-Type": "multipart/form-data" }),
	});
}

export async function toggleActivation(
	pk: ID,
	verified: boolean,
	pathname: string
) {
	return actionRequest({
		pathname,
		method: "put",
		data: { verified, pk },
		url: "/vendors/certificates/verification/",
	});
}
