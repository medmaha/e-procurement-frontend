//

import { isValid, isAfter } from "date-fns";

export function isDeadlineDate(deadline?: string) {
  if (!deadline || !isValid(new Date(deadline))) return false;

  return isAfter(new Date(), new Date(deadline));
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
	
	
	// TODO: Check if user can evaluate the RFQ
	
	let isPossible = true;
	
	for (const quotation of quotations.slice(1,)) {
		if (isDeadlineDate(quotation.rfq?.quotation_deadline_date)) {
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
