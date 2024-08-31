"use server";
import { convertUrlSearchParamsToSearchString } from "@/lib/helpers";
import { actionRequest } from "@/lib/utils/actionRequest";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Creates a new annual plan with the given data
 */
async function createAnnualPlan(data: Json, pathname?: string) {
	return await actionRequest({
		data,
		pathname,
		method: "post",
		url: "/organization/annual-plan/create/" + getQueryString(),
	});
}

/**
 * Approves an annual plan
 */
async function requestAnnualPlanApproval(data: Json, pathname?: any) {
	const response = await actionRequest({
		data,
		pathname,
		method: "put",
		url: "/organization/annual-plan/approval/request/",
	});
	if (response.success) {
		revalidatePath(pathname || "/organization/annual-plan/approve/");
	}
	return response;
}

/**
 * Approves an annual plan
 */
async function approveAnnualPlan(data: Json, pathname?: any) {
	const response = await actionRequest({
		data,
		pathname,
		method: "put",
		url: "/organization/annual/plan/approve/" + getQueryString(),
	});
	if (response.success) {
		revalidatePath(pathname || "/organization/annual-plan/approve/");
	}
	return response;
}

/**
 * Creates a new departmental procurement plan
 */
async function createDepartmentProcurementPlan(data: Json, path?: string) {
	return await actionRequest({
		data,
		pathname: path,
		method: "post",
		url: "/organization/annual-plan/departmental/create/" + getQueryString(),
	});
}

/**
 * Returns the query string from the referer
 */
function getQueryString() {
	const header = headers();
	const referer = header.get("referer");
	if (referer) {
		const url = new URL(referer);
		return convertUrlSearchParamsToSearchString(
			Object.fromEntries(url.searchParams.entries())
		);
	}
	return "";
}

export { createAnnualPlan, approveAnnualPlan, createDepartmentProcurementPlan, requestAnnualPlanApproval };
