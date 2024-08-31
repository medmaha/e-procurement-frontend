import { format } from 'date-fns';
import React from 'react';
import APP_COMPANY from '@/APP_COMPANY';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { DataTableCell } from '../../pdf/DataTableCell';
import Table from '../../pdf/Table';
import { TableBody } from '../../pdf/TableBody';
import { TableCell } from '../../pdf/TableCell';
import { TableHeader } from '../../pdf/TableHeader';
import { transformToArray } from '../Utils';


type Identifier = {
	user_department: string;
	requisition_number: string;
	date: string;
	location: string;
	date_required: string;
};

type Props = {
	organization?: typeof APP_COMPANY;
	identifier?: Identifier;
};

export default function ItemsTable(props: Props) {
	props = {
		organization: APP_COMPANY,
		identifier: props.identifier ?? defaultData,
	};
	return (
		<View style={{ paddingBottom: 5, paddingTop: 10, marginBottom: 25 }}>
			<View
				style={[
					styles.flex,
					{
						flexDirection: "row",
						gap: 4,
						marginBottom: 20,
					},
				]}
			>
				<View
					style={[
						styles.flex,
						{
							flex: 1,
							flexDirection: "column",
						},
					]}
				>
					<Text style={[{ color: "#444", textAlign: "center" }]}>
						Procurement Requisition {"[" + "GPPA 28" + "]"}
					</Text>
					<Text
						style={[
							{ color: "#666", textAlign: "center", fontSize: 9, marginTop: 2 },
						]}
					>
						For Submission to Specialized Procurement Unit (SPU)
					</Text>
				</View>
				<Text style={[{ color: "#444", fontSize: 7 }]}>GPPA-FORM 100</Text>
			</View>
			<View>
				<Table data={transformToArray(props.identifier)}>
					<TableHeader fontSize={8}>
						{columns.map((col, idx) => (
							<TableCell
								fontSize={10}
								style={[
									styles.text,
									styles.bold,
									!!col.match(/date/gi) ? styles.date : {},
								]}
								key={col}
							>
								{col}
							</TableCell>
						))}
					</TableHeader>
					<TableBody fontSize={6}>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={(r: Identifier) => props.organization?.name}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={(r: Identifier) => r.user_department}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={(r: Identifier) => r.requisition_number}
						/>
						<DataTableCell
							fontSize={6}
							style={[styles.text, styles.date]}
							getContent={(r: Identifier) => format(new Date(r.date), "P")}
						/>
						<DataTableCell
							fontSize={6}
							style={[styles.text]}
							getContent={(r: Identifier) =>
								r.location || props.organization?.name
							}
						/>
						<DataTableCell
							fontSize={6}
							style={[styles.text, styles.date]}
							getContent={(r: Identifier) =>
								format(new Date(r.date_required), "P")
							}
						/>
					</TableBody>
				</Table>
			</View>
		</View>
	);
}

const columns = [
	"Procuring Organization",
	"User Department",
	"Requisition S/No.",
	"Date",
	"Delivery Location",
	"Date Required",
];

export const styles = StyleSheet.create({
	date: {
		maxWidth: 50,
		padding: "3px",
	},

	text: {
		padding: "3px",
	},
	bold: {
		fontFamily: "Oswald",
	},

	flex: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

const defaultData: Identifier = {
	date: new Date("08/02/2023").toISOString(),
	user_department: "HR Management",
	location: "",
	date_required: new Date("08/04/2023").toISOString(),
	requisition_number: Math.random()
		.toString()
		.replace(".", "")
		.substring(0, 12),
};
