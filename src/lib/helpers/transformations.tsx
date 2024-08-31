//

import { headers } from "next/headers";

export function convertUrlSearchParamsToSearchString(searchParams: Json) {
	let string = "";
	const keys = Object.keys(searchParams);
	const values = Object.values(searchParams);

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = values[i];
		let next = !!keys[i + 1] ? "&" : "";
		string += key + "=" + value + next;
	}

	if (string.length > 2) string = "?" + string;
	return string;
}

export function transformFormDataWithItems(formData: FormData) {
	let items: Json[] = [];
	const data: Json = {};

	let item: Json = {};

	let currentIndex = 1;
	let addAfterIteration = true;

	const startsWithNumber = /^\d+-/;
	const iterable = Object.fromEntries(formData.entries());

	for (const key in iterable) {
		const value = iterable[key];
		if (key.match(startsWithNumber)) {
			const prefix = Number((key.match(/^\d+/) || [])[0] ?? 1);
			const cleaned_key = key.replace(/^\d+-/, "");
			if (prefix === currentIndex) {
				item[cleaned_key] = value;
				addAfterIteration = true;
			} else {
				items.push(item);
				currentIndex = prefix;
				item = {}; // resets the currentItem item
				item[cleaned_key] = value;
				addAfterIteration = false;
			}
		} else {
			data[key] = String(value).trim();
		}
	}

	if (addAfterIteration) {
		items.push(item);
	}

	return { ...data, items } as Json;
}

// prettier-ignore
export function formatNumberAsCurrency(value: number|string, locales =new Intl.Locale("en-GM"), currency="GMD") {
	if (!value) return "0.00";

	try {
		let c = Number(value).toLocaleString(locales, {
			currency,
			
		});

		// if (!c.includes(".00")) c+=".00"
		return c
	} catch (error) {
		return value;
	}
}

/**
 * Transform a single item to an array (with one element).
 * Or return the array.
 *
 * @param items the item or items to transform to an array.
 * @return an array of items or an empty array.
 */
export function transformToArray<T>(items?: T | T[]): T[] {
	if (items === undefined) {
		return [];
	}

	if (Array.isArray(items)) {
		return items;
	}

	return [items];
}
