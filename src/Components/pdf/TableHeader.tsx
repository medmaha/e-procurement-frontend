"use client";
import React, { useMemo } from 'react';
import { TableRow } from './TableRow';
import { getDefaultBorderIncludes } from './Utils';


/**
 * This component displays the titles for the rows.
 */
export function TableHeader(props: TableHeaderProps) {
	const rowCells: any[] = React.Children.toArray(props.children);
	const {
		includeLeftBorder,
		includeBottomBorder,
		includeRightBorder,
		includeTopBorder,
	} = useMemo(() => getDefaultBorderIncludes(props), [props]);

	return (
		<TableRow
			key={"header"}
			includeLeftBorder={includeLeftBorder}
			includeBottomBorder={includeBottomBorder}
			includeRightBorder={includeRightBorder}
			includeTopBorder={includeTopBorder}
			fontSize={props.fontSize}
			textAlign={props.textAlign}
			zebra={props.zebra}
			even={props.even}
			evenRowColor={props.evenRowColor}
			oddRowColor={props.oddRowColor}
			data={props.data}
		>
			{rowCells.map((rc, columnIndex) =>
				React.cloneElement(rc, {
					key: columnIndex,
					isHeader: true,
					fontSize: props.fontSize,
					textAlign: props.textAlign,
					includeLeftBorder: columnIndex === 0,
					includeRightBorder: columnIndex !== rowCells.length - 1,
				})
			)}
		</TableRow>
	);
}
