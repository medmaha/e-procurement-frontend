"use client";

import React, { ReactElement, useMemo } from 'react';
import { View } from '@react-pdf/renderer';
import { DataTableCell } from './DataTableCell';
import { getDefaultBorderIncludes } from './Utils';


/**
 * This component describes how to display a row.
 */
export function TableRow(props: TableRowProps) {
	const rowCells = useMemo(
		() => React.Children.toArray(props.children),
		[props.children]
	);
	const {
		includeLeftBorder,
		includeBottomBorder,
		includeRightBorder,
		includeTopBorder,
	} = useMemo(() => getDefaultBorderIncludes(props), [props]);

	let remainingWeighting = 1;
	let numberOfWeightingsDefined = 0;
	// @ts-ignore
	rowCells.forEach((i: TableCell | typeof DataTableCell) => {
		if (i.props.weighting !== undefined) {
			remainingWeighting -= i.props.weighting;
			numberOfWeightingsDefined++;
		}
	});

	const weightingsPerNotSpecified = Math.ceil(
		remainingWeighting / (rowCells.length - numberOfWeightingsDefined)
	);

	const rowColor =
		(props.zebra || props.evenRowColor) && props.even
			? props.evenRowColor || "lightgray"
			: props.oddRowColor || "";

	return (
		<View
			// @ts-ignore
			style={{
				borderBottom: includeBottomBorder && "1pt solid black",
				borderRight: includeRightBorder && "1pt solid black",
				borderLeft: includeLeftBorder && "1pt solid black",
				borderTop: includeTopBorder && "1pt solid black",
				width: "100%",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				backgroundColor: rowColor,
			}}
		>
			{rowCells.map((rc, columnIndex) =>
				React.cloneElement(rc as ReactElement, {
					weighting: (rc as any)?.props?.weighting ?? weightingsPerNotSpecified,
					data: props.data,
					key: columnIndex,
					index: props.index,
					fontSize: props.fontSize,
					textAlign: props.textAlign,
					includeLeftBorder: columnIndex === 0,
					includeRightBorder: columnIndex !== rowCells.length - 1,
				})
			)}
		</View>
	);
}
