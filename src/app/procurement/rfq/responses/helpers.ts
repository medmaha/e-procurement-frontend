//

export function isDeadlineDate(deadline: string) {
	const today = new Date().getTime();
	const deadlineDate = new Date(deadline).getTime();
	return today >= deadlineDate;
}

/**
 * Whether these quotation set can be evaluated
 * - Check if user has permissions to evaluate the quotations
 * - Also checks to see if the quotations belongs to the same RFQ
 */
// prettier-ignore
export function quotationsCanBeEvaluated(quotations: RFQResponse[], user: AuthUser) {
	const rfq = quotations.at(0)?.rfq;

	
	if (!rfq) return null;
	
	if (rfq.open_status === true) return null
	
	
	// TODO: Check if user can evaluate the RFQ
	
	let isPossible = true;
	
	for (const quotation of quotations.slice(1,)) {
		if (!quotation.rfq.open_status) {
			if (quotation.rfq.id !== rfq?.id) {
				isPossible = false
				break
			};
		}
		else{
			isPossible = false
			break
		}
	}
	return isPossible ? rfq :null;
}
