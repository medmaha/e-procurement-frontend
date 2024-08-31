interface ContextData {
	factors: Factor[];
	totalWeight: number;
	addFactor: (factor: Factor) => void;
	removeFactor: (factor_id: string) => void;
	updateWeight: (factor_id: string, number: number) => void;
}

interface Factor {
	label: string;
	weight: number;
	id: string;
}
