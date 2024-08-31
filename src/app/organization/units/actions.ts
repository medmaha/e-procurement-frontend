"use server";

import { revalidatePath } from 'next/cache';
import { axiosInstance } from '@/lib/axiosInstance';
import { actionRequest } from '@/lib/utils/actionRequest';


export async function createUnit(json: any, pathname?: string) {
	const response = await actionRequest({
		pathname,
		data: json,
		method: "post",
		url: "/organization/units/create/",
	});
	return response;
}

export async function updateUnit(json: any, pathname?: string) {
	const response = await actionRequest({
		pathname,
		data: json,
		method: "put",
		url: "/organization/units/update/",
	});
	return response;
}

export async function getStaffs() {
	return actionRequest({
		method: "get",
		url: "/organization/staffs/select/",
	});
}

export async function retrieveUnit(id: string) {
	const response = await actionRequest({
		method: "get",
		url: `/organization/units/${id}/`,
	});
	return response;
}
export async function retrieveUpdateUnit(id: string) {
	const response = await actionRequest({
		method: "get",
		url: `/organization/units/retrieve/${id}/`,
	});
	return response;
}

export async function getDepartmentsList(pathname?: string) {
	const response = await actionRequest({
		pathname,
		method: "get",
		url: "/organization/plans/departments/",
	});

	return response;
}
