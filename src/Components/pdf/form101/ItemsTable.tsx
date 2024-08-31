import React from "react";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { StyleSheet } from "@react-pdf/renderer";
import { DataTableCell } from "../../pdf/DataTableCell";
import Table from "../../pdf/Table";
import { TableBody } from "../../pdf/TableBody";
import { TableCell } from "../../pdf/TableCell";
import { TableHeader } from "../../pdf/TableHeader";
import { Form101RFQItemsProps } from "./types";

export default function ItemsTable(props: Form101RFQItemsProps) {
	const MIN_LENGTH = 15;
	const data: typeof props.data =
		props.data.length < MIN_LENGTH
			? [...props.data, ...new Array(MIN_LENGTH - props.data.length).fill({})]
			: props.data;

	return (
		<Table data={data}>
			<TableHeader fontSize={9}>
				{columns.map((col, idx) => (
					<TableCell style={(colsStyles as any)[`col${idx + 1}`]} key={col}>
						{col}
					</TableCell>
				))}
			</TableHeader>
			<TableBody fontSize={6}>
				{/* {new Array(Object.keys(data[0]).length).fill({}).map((_, idx) => (
					<DataTableCell
						style={(colsStyles as any)[`col${idx + 1}`]}
						key={idx}
						getContent={(r: (typeof data)[0]) => {
							// return appropriate key
							if (idx === 0) return (r as any).index + 1;

							const keys = Object.keys(r);
							return (r as any)[keys[idx]];
						}}
					/>
				))} */}
				<DataTableCell
					style={[colsStyles.col1, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) =>
						r && Number((r as any).index || 0) + 1
					}
				/>
				<DataTableCell
					style={[colsStyles.col2, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) => r.item_description}
				/>
				<DataTableCell
					style={[colsStyles.col3, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) => r.measurement_unit}
				/>
				<DataTableCell
					style={[colsStyles.col4, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) => r.quantity}
				/>
				<DataTableCell
					style={[colsStyles.col5, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) => r.eval_criteria}
				/>
				<DataTableCell
					style={colsStyles.col6}
					getContent={(r: (typeof data)[0]) => r.unit_price}
				/>
				<DataTableCell
					style={[colsStyles.col7, colsStyles.dataText]}
					getContent={(r: (typeof data)[0]) =>
						r.unit_price
							? r.quantity
								? "" +
								  formatNumberAsCurrency(
										Number(r.quantity) * Number(r.unit_price)
								  )
								: ""
							: ""
					}
				/>
				<DataTableCell
					style={colsStyles.col8}
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
	"Qty",
	"Evaluation Criteria",
	"Unit Price (GMD)",
	"Bid Price (GMD)",
	"Remarks",
];

const minHeight = 5;

export const colsStyles = StyleSheet.create({
	dataText: {
		minHeight,
		fontSize: 10,
	},
	col1: {
		// Row Index
		flexBasis: 15,
		maxWidth: 20,
		padding: "3px",
	},
	col2: {
		flexBasis: 100,
		maxWidth: 150,
		padding: "3px",
	},
	col3: {
		// Measurement Unit
		padding: "3px",
		flexBasis: 50,
		maxWidth: 100,
		textTransform: "capitalize",
	},
	col4: {
		// Quantity
		flexBasis: 15,
		maxWidth: 25,
		padding: "3px",
	},
	col5: {
		// Evaluation Criteria
		flexBasis: 80,
		maxWidth: 120,
		padding: "3px",
	},
	col6: {
		// Unit Price
		flexBasis: 35,
		maxWidth: 45,
		padding: "3px",
		backgroundColor: "#f2f2f2",
	},
	col7: {
		// Total Price
		flexBasis: 35,
		maxWidth: 45,
		padding: "3px",
		backgroundColor: "#f2f2f2",
	},
	col8: {
		// Remarks
		flexBasis: 100,
		maxWidth: 130,
		padding: "3px",
		backgroundColor: "#f2f2f2",
	},
});
