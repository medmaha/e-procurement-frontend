"use client";

import React, { useMemo } from 'react';
import ReactPDF, { Text, View } from '@react-pdf/renderer';
import { getDefaultBorderIncludes, transformToArray } from './Utils';


/**
 * This component displays the associated content of it's children.
 */
export const TableCell: React.FC<TableCellProps> = (props) => {
	const { includeRightBorder } = getDefaultBorderIncludes(props);

	// @ts-ignore
	const defaultStyle: ReactPDF.Style = useMemo(
		() => ({
			flex: props.weighting ?? 1,
			justifyContent: "stretch",
			textAlign: props.textAlign ?? "left",
			fontSize: props.fontSize ?? (props.isHeader === true ? 9 : 7),

			borderRight: includeRightBorder && "1pt solid black",
		}),
		[props, includeRightBorder]
	);

	// @ts-ignore
	const mergedStyles: ReactPDF.Style[] = useMemo(
		() => [defaultStyle, ...transformToArray(props.style)],
		[defaultStyle, props.style]
	);

	return (
		<View style={mergedStyles} wrap={true}>
			{typeof props.children === "string" && <Text>{props.children}</Text>}
			{typeof props.children === "number" && (
				<Text>{props.children.toString()}</Text>
			)}
			{!["number", "string"].includes(typeof props.children) && props.children}
		</View>
	);
};
