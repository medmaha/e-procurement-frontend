import React from "react";
import ProcurementEvaluation from "./Components/Main";

export default function Page() {
	return (
		<section className="section">
			<div className="max-w-[1200px] mx-auto">
				<div className="section-heading">
					<h1 className="heading-text">RFQ Evaluation</h1>
				</div>
				<ProcurementEvaluation />
			</div>
		</section>
	);
}
