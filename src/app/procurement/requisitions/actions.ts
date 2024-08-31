"use server";
import { actionRequest } from "@/lib/utils/actionRequest";

export async function createRequisition(
	json: any,
	pathname?: string,
	update?: boolean
) {
	const response = await actionRequest({
		pathname,
		data: json,
		method: update ? "put" : "post",
		url: update
			? "/procurement/requisitions/update/"
			: "/procurement/requisitions/create/",
	});
	return response;
}
export async function retrieveRequisition(_id: string) {
	const response = await actionRequest({
		method: "get",
		url: "/procurement/requisitions/" + _id + "/",
	});
	return response;
}

export async function approveRequisition(data: Json, pathname: string) {
	return actionRequest({
		data,
		pathname,
		method: "put",
		url: "/procurement/requisitions/approve/",
	});
}

export async function getDepartmentProcurementPlanItems(department_id: ID) {
	const response = await actionRequest<DepartmentProcurementPlan["items"]>({
		method: "get",
		url:
			"/organization/annual-plan/departmental/select/?department_id=" +
			department_id,
	});
	return response;
}
export async function getRequisitionDepartmentProcurementPlans(
	requisition_id: number
) {
	const response = actionRequest<DepartmentProcurementPlan>({
		method: "get",
		url:
			"/organization/annual-plan/departmental/list/?requisition_id=" +
			requisition_id,
	});
	return response;
}
