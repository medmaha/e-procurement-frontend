import React from "react";
import { StarIcon, StarHalfIcon, Star } from "lucide-react";

type Props = {
	length: number;
	width?: number;
};

export default function Rating({ length = 0, width = 14 }: Props) {
	const isFloat = Number.isInteger(length) === false;
	const integerPart = Math.floor(length);
	const remainingPart = isFloat ? 1 : 0;
	return (
		<>
			{[...Array(integerPart)].map((_, i) => (
				<StarIcon
					key={i}
					className={`text-sky-500 fill-sky-500 dark:fill-white inline-block min-w-max min-h-max ${
						i !== 0 ? "pl-1.5" : ""
					}`}
					width={width}
					height={width}
				/>
			))}
			{isFloat && (
				<StarHalfIcon
					key="half-star"
					className="text-sky-500 fill-sky-500 dark:fill-white inline-block min-w-max min-h-max pl-1.5"
					width={width}
					height={width}
				/>
			)}
			{[...Array(5 - integerPart - remainingPart)].map((_, i) => (
				<StarIcon
					key={`empty-star-${i}`}
					className="text-muted-foreground fill-muted inline-block min-w-max min-h-max pl-1.5"
					width={width}
					height={width}
				/>
			))}
		</>
	);
}
