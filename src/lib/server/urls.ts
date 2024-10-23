import { redirect } from "next/navigation";

export function returnTo(base: string, next?: string, queryParams?: Json) {
	const searchString = searchParamsToSearchString(queryParams || ({} as Json));
	if (next) {
		return redirect(`${base}?next=${next}${searchString}`);
	}
	return redirect(`${base}${searchString}`);
}

export function searchParamsToSearchString(searchParams: Json) {
	return convertUrlSearchParamsToSearchString(
		removeDuplicateKeys(searchParams)
	);
}

export function removeDuplicateKeys(searchParams: Json) {
	let data = {} as Json;
	Object.keys(searchParams).forEach((key) => {
		data[key] = searchParams[key];
	});
	return data;
}

function convertUrlSearchParamsToSearchString(json: Json, emitNext = true) {
	let string = "";
	const keys = Object.keys(json);
	const values = Object.values(json);

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		if (emitNext && key === "next") continue;
		let value = values[i];

		if (Array.isArray(value)) {
			value = value.at(-1)!;
		}

		string += key + "=" + value;
		let next = !!keys[i + 1];
		if (next) string += "&";
	}

	if (string === "") return "";

	if (string.endsWith("?")) string = string.slice(0, -1);

	string = "?" + string;
	return string;
}
