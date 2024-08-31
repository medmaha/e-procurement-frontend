interface Store {
	cacheId: string;
	data: {
		[quotation_id: string]: QuoteEvaluation;
	};
}
