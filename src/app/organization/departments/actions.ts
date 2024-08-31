"use server";
import { axiosInstance } from '@/lib/axiosInstance';
import { actionRequest } from '@/lib/utils/actionRequest';


export async function createDepartment(data: Json, pathname?: string) {
	return actionRequest({data, pathname, method:"post", url:"/organization/departments/create/"})
}

export async function updateDepartment(data: Json, pathname?: string) {
	return actionRequest({data, pathname, method:"put", url:"/organization/departments/update/"})
}



export async function retrieveDepartment(id: string) {
	return actionRequest({
		method: "get",
		url: "/organization/departments/" + id + "/",
	});
}
