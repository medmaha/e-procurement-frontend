"use server";

import { actionRequest } from "@/lib/utils/actionRequest";

export async function getRFQOpenedBy(rfq_id?: ID) {
	const response = await actionRequest({
		method: "get",
		url: "/procurement/rfq/opened-by/" + (rfq_id ? rfq_id + "/" : ""),
	});
	return response;
}

export async function getVendorSelection() {
	return actionRequest({
		method: "get",
		url: "/vendors/select/",
	});
}

export async function getUnitSelection() {
	const response = await actionRequest({
		method: "get",
		url: "/organization/units/select/",
	});

	return response;
}

export async function getRequisitionSelection() {
	const response = await actionRequest({
		method: "get",
		url: "/procurement/requisitions/select/",
	});

	return response;
}
export async function getAuthGroupSelection() {
	const response = await actionRequest({
		method: "get",
		url: "/account/groups/select/",
	});

	return response;
}

export async function getDepartmentProcurementPlanSelection(department_id: ID) {
	const response = await actionRequest({
		method: "get",
		url: "/organization/plans/select/" + department_id + "/",
	});
	return response;
}
export async function getStaffSelections() {
	return actionRequest({
		method: "get",
		url: "/organization/staffs/select/",
	});
}

export async function getDepartmentSelection() {
	const response = await actionRequest({
		method: "get",
		url: "/organization/departments/select/",
	});

	return response;
}
