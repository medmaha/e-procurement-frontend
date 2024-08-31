import React from "react";
import Weighter from "./Weighter";
import Scorer from "./Scorer";
import EvaluationContextProvider from "./Context";

const initialFactors = [
	{ label: "Price", weight: 45, id: "price" },
	{ label: "Delivery Time", weight: 15, id: "delivery Time" },
	{ label: "Service Quality", weight: 15, id: "quality" },
	{ label: "Specifications", weight: 25, id: "specifications" },
] as Factor[];

const ProcurementEvaluation: React.FC = () => {
	return (
		<EvaluationContextProvider initialData={initialFactors}>
			<Weighter />
			<Scorer />
		</EvaluationContextProvider>
	);
};

export default ProcurementEvaluation;
