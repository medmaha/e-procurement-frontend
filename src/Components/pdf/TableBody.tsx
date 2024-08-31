"use client";

import React, { useMemo } from 'react';
import { TableRow } from './TableRow';
import { getDefaultBorderIncludes } from './Utils';


/**
 * This component displays the data as {@see TableRow}s.
 */
export function TableBody(props: InternalBodyProps) {
	const rowCells = React.Children.toArray(props.children);
	const { data = [] } = props;

	const { includeLeftBorder, includeBottomBorder, includeRightBorder } =
		useMemo(() => getDefaultBorderIncludes(props), [props]);

	const renderedRows = useMemo(() => {
		return data.map((rowData, rowIndex) => (
			<TableRow
				index={rowIndex}
				key={rowIndex}
				even={rowIndex % 2 === 0}
				data={rowData}
				includeLeftBorder={includeLeftBorder}
				includeBottomBorder={includeBottomBorder}
				includeRightBorder={includeRightBorder}
				includeTopBorder={props.renderTopBorder}
			>
				{rowCells}
			</TableRow>
		));
	}, [
		data,
		rowCells,
		includeLeftBorder,
		includeBottomBorder,
		includeRightBorder,
		props.renderTopBorder,
	]);

	return <>{renderedRows}</>;
}
