import React from 'react';
import APP_COMPANY from '@/APP_COMPANY';
import { formatNumberAsCurrency } from '@/lib/helpers';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { DataTableCell } from '../../pdf/DataTableCell';
import Table from '../../pdf/Table';
import { TableBody } from '../../pdf/TableBody';
import { TableCell } from '../../pdf/TableCell';
import { TableHeader } from '../../pdf/TableHeader';
import { transformToArray } from '../Utils';
import { Form100Approval } from './types';


type Identifier = {
	user_department: string;
	requisition_number: string;
	date: string;
	location: string;
	date_required: string;
};

type Props = {
	organization?: Json;
	identifier?: Identifier;
	approval: Form100Approval;
	remarks: string;
	authoredBy: string;
	officer_id: ID;
};

export default function Approvals(props: Props) {
	props = {
		...props,
		organization: APP_COMPANY,
		identifier: props.identifier ?? defaultData,
	};
	return (
		<View style={{ marginTop: 15 }}>
			<View>
				<Table data={transformToArray(props.identifier)}>
					<TableHeader fontSize={8}>
						{columns1.map((col, idx) => (
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
							getContent={() =>
								props.approval.finance_approval.id
									? props.approval.finance_approval.funds_confirmed
										? "Yes"
										: "No"
									: "N/A"
							}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={() =>
								props.approval.expenditure_head ?? "Accounting Officer"
							}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={() => ""}
						/>

						<DataTableCell
							fontSize={6}
							style={[styles.text]}
							getContent={() =>
								props.approval.procurement_approval.id
									? props.approval.procurement_approval.part_of_annual_plan
										? "Yes"
										: "No"
									: ""
							}
						/>

						<DataTableCell
							fontSize={6}
							style={[styles.text, styles.bold]}
							getContent={() =>
								props.approval.total_sum
									? "D" +
									  formatNumberAsCurrency(Number(props.approval.total_sum))
									: ""
							}
						/>
					</TableBody>
				</Table>
			</View>
			<View style={{ marginTop: 15 }}>
				<Table data={transformToArray(props.identifier)}>
					<TableHeader fontSize={8}>
						{columns2.map((col, idx) => (
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
							getContent={(r: Identifier) =>
								props.approval.department_approval.status
							}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={(r: Identifier) =>
								props.approval.finance_approval.status
							}
						/>
						<DataTableCell
							fontSize={6}
							style={styles.text}
							getContent={(r: Identifier) =>
								props.approval.procurement_approval.id
							}
						/>
					</TableBody>
				</Table>
			</View>
			<View style={{ marginTop: 15, display: "flex", flexDirection: "row" }}>
				<View
					style={{
						maxWidth: 150,
						height: "100%",
						backgroundColor: "#f2f2f2",
						padding: 1,
						border: 1,
						borderRight: 0,
					}}
				>
					<Text style={{ backgroundColor: "#f2f2f2", padding: 3, fontSize: 7 }}>
						Person who developed statement of Requirements (If different from
						Originating Officer)
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Table data={transformToArray(props.identifier)}>
						<TableHeader fontSize={8}>
							{["name", "Designation"].map((col, idx) => (
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
								style={[styles.text, { minHeight: 25 }]}
								getContent={(r: Identifier) => ""}
							/>
							<DataTableCell
								fontSize={6}
								style={styles.text}
								getContent={(r: Identifier) => ""}
							/>
						</TableBody>
					</Table>
				</View>
			</View>
			<View
				style={[
					{
						marginTop: 15,
						display: "flex",
						flexDirection: "row",
						gap: 4,
						justifyContent: "space-between",
					},
				]}
			>
				<View style={{ flex: 1, maxWidth: 350 }}>
					<Text style={[styles.bold, { fontSize: 10 }]}>Remarks</Text>
					<Text style={{ lineHeight: 1, fontSize: 8, opacity: 0.7 }}>
						{props.remarks || "-"}
					</Text>
				</View>
				<View
					style={[
						{
							minWidth: 200,
							display: "flex",
							flexDirection: "column",
							// justifyContent: "center",
							alignItems: "center",
						},
					]}
				>
					<View>
						<View>
							<Text style={[styles.bold, { fontSize: 10 }]}>Authored By</Text>
							<Text style={{ lineHeight: 1, fontSize: 8, opacity: 0.7 }}>
								{props.authoredBy}
							</Text>
						</View>
						<View style={{ opacity: 0.6, marginTop: 3 }}>
							<Text style={[styles.bold, { fontSize: 8 }]}>Staff Id</Text>
							<Text style={{ lineHeight: 1, fontSize: 7, opacity: 0.7 }}>
								{props.officer_id || "S0000420"}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const columns1 = [
	"Funds Availability Confirmed (Budget Officer)",
	"Expenditure Head",
	"Programme Project",
	"Part Of Annual Plan",
	"Grand Total",
];
const columns2 = [
	"Confirmation of Need (Department Head)",
	"Confirmation of Fund (Budget Officer)",
	"Approval to Continue With Procurement (Account Officer)",
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
