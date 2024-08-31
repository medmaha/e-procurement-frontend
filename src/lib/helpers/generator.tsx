//

export function generate_unique_id(prefix: string, unique_id: ID, zeroes = 5) {
	const i = revert_unique_id(unique_id);
	return prefix + new Array(zeroes - String(i).length).fill(0).join("") + i;
}
export function revert_unique_id(unique_id: ID): ID {
	// unique_id example: EMP00010
	// return example: 10
	// unique_id example: EMP00002
	// return example: 2

	try {
		// Extract the numeric part of the unique_id using regex
		const numericPart = String(unique_id).replace(/[a-zA-Z]+/g, "");

		// Remove leading zeros
		const trimmedNumericPart = numericPart.replace(/^0+/, "");
		// Return the result
		return trimmedNumericPart || "0"; // Return '0' if the resulting string is empty
	} catch (error) {
		return "0";
	}
}
