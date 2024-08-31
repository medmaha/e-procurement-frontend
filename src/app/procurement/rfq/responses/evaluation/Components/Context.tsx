"use client";
import { useState, useEffect, createContext, ReactNode, useRef } from "react";

type Props = {
	initialData: Factor[];
	children: ReactNode;
};

export const EvaluationContext = createContext({} as ContextData);

export default function EvaluationContextProvider(props: Props) {
	const [factors, setFactors] = useState<Factor[]>(props.initialData);
	const totalWeight = useRef(factors.reduce((a, c) => (a += c.weight), 0));

	function updateWeight(factor_id: string, weight: number) {
		const factor = factors.find((f) => f.id === factor_id);
		if (!factor) return;
		const _factors = factors.reduce((acc, current) => {
			if (factor.id === current.id) {
				current.weight = weight;
			}
			acc.push(current);
			return acc;
		}, [] as Factor[]);
		totalWeight.current = _factors.reduce((a, c) => (a += c.weight), 0);
		setFactors(_factors);
	}

	function addFactor(factor: Factor) {
		setFactors((prev) => {
			const f = [...prev, factor];
			totalWeight.current = f.reduce((a, c) => (a += c.weight), 0);
			return f;
		});
	}

	function removeFactor(factor_id: string) {
		setFactors((prev) => {
			const f = prev.filter((f) => f.id !== factor_id);
			totalWeight.current = f.reduce((a, c) => (a += c.weight), 0);
			return f;
		});
	}

	return (
		<EvaluationContext.Provider
			value={{
				factors,
				addFactor,
				updateWeight,
				removeFactor,
				totalWeight: totalWeight.current,
			}}
		>
			{props.children}
		</EvaluationContext.Provider>
	);
}
