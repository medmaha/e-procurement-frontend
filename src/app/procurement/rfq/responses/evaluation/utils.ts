import { toast } from "react-toastify";

type Sanitizer = (
	data: QuoteEvaluation,
	quotation: RFQResponse,
	item: RFQItem
) => Json | null;

export const sanitizeEvaluationData: Sanitizer = (data, quotation, rfqItem) => {
	const _data = {
		...data,
		item_id: rfqItem.id,
		quotation_id: quotation.id,
		specifications: !!data.specifications,
		rating: data.rating || 1,
		comments: data.comments,
		quantity: data.quantity || rfqItem.quantity,
		pricing: data.pricing || quotation.pricing,
	};

	if ((!_data.comments || _data.comments.length < 5) && !data.id) {
		toast.error("Comment is required with minimum characters of 5", {
			position: "top-center",
			hideProgressBar: true,
		});
		return null;
	}
	return _data;
};
