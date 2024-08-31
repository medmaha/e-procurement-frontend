import React from 'react';
import { TableCell } from './TableCell';


/**
 * This component is used to display data in the the {@see TableRow} component.
 */
export function DataTableCell(props: DataTableCellProps) {
	return (
		<TableCell {...props}>
			{props.getContent({ ...props.data, index: props.index })}
		</TableCell>
	);
}
