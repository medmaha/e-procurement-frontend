import React from 'react';
import { formatNumberAsCurrency } from '@/lib/helpers';
import { StyleSheet } from '@react-pdf/renderer';
import { DataTableCell } from '../../pdf/DataTableCell';
import Table from '../../pdf/Table';
import { TableBody } from '../../pdf/TableBody';
import { TableCell } from '../../pdf/TableCell';
import { TableHeader } from '../../pdf/TableHeader';
import { Form101RFQItemsProps } from './types';


type Props = {
	items: Form101RFQItemsProps[];
};

export default function ItemsTable(props: Props) {
	const MIN_LENGTH = 5;
	const data =
		props.items.length < MIN_LENGTH
			? [...props.items, ...new Array(MIN_LENGTH - props.items.length).fill({})]
			: props.items;

	return (
		<Table data={data}>
			<TableHeader fontSize={8}>
				{columns.map((col, idx) => (
					<TableCell
						style={[(colsStyles as any)[`col${idx + 1}`], colsStyles.bold]}
						key={col}
					>
						{col}
					</TableCell>
				))}
			</TableHeader>
			<TableBody fontSize={6}>
				<DataTableCell
					style={colsStyles.col1}
					getContent={(r: (typeof data)[0]) =>
						(r as any).index ? Number((r as any).index) + 1 : ""
					}
				/>
				<DataTableCell
					style={colsStyles.col2}
					getContent={(r: (typeof data)[0]) => r.description}
				/>
				<DataTableCell
					style={[colsStyles.col3]}
					getContent={(r: (typeof data)[0]) => r.measurement_unit}
				/>
				<DataTableCell
					style={colsStyles.col4}
					getContent={(r: (typeof data)[0]) => r.quantity}
				/>
				<DataTableCell
					style={colsStyles.col5}
					getContent={(r: (typeof data)[0]) =>
						r.unit_cost
							? formatNumberAsCurrency(Number(Number(r.unit_cost).toFixed(0)))
							: ""
					}
				/>
				<DataTableCell
					style={colsStyles.col6}
					getContent={(r: (typeof data)[0]) =>
						r.quantity
							? "" +
							  formatNumberAsCurrency(Number(r.quantity) * Number(r.unit_cost))
							: ""
					}
				/>
				<DataTableCell
					style={colsStyles.col7}
					getContent={(r: (typeof data)[0]) => r.remarks}
				/>
			</TableBody>
		</Table>
	);
}

const columns = [
	"No.",
	"Item Description",
	"Measurement Unit",
	"QTY",
	"Unit Price (GMD)",
	"Total Price (GMD)",
	"Remarks",
];

export const colsStyles = StyleSheet.create({
	col1: {
		maxWidth: 25,
		padding: "3px",
	},
	col2: {
		flex: 3,
		padding: "3px",
	},
	col3: {
		flex: 1,
		padding: "3px",
		flexBasis: 25,
	},
	col4: {
		maxWidth: 40,
		padding: "3px",
	},
	col5: {
		maxWidth: 60,
		padding: "3px",
	},
	col6: {
		maxWidth: 60,
		padding: "3px",
	},
	col7: {
		flex: 2,
		padding: "3px",
	},
	bold: {
		fontFamily: "Oswald",
	},
});
