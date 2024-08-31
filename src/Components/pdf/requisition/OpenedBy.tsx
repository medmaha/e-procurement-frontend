import React from 'react';
import { StyleSheet, View } from '@react-pdf/renderer';
import { DataTableCell } from '../../pdf/DataTableCell';
import Table from '../../pdf/Table';
import { TableBody } from '../../pdf/TableBody';
import { TableCell } from '../../pdf/TableCell';
import { TableHeader } from '../../pdf/TableHeader';
import { Form101OpenByProps } from './types';


export default function OpenedBy(props: Form101OpenByProps) {
	return (
		<View style={{ flex: 1 }}>
			<Table data={openedBy}>
				<TableHeader>
					<TableCell style={{ ...colsStyles.col1, fontSize: 8 }}>
						Opened By
					</TableCell>
					<TableCell style={{ ...colsStyles.col2 }}>Name</TableCell>
					<TableCell style={{ ...colsStyles.col3 }}>Designation</TableCell>
				</TableHeader>
				<TableBody>
					<DataTableCell
						style={{ ...colsStyles.col1 }}
						getContent={(r: (typeof openedBy)[0]) => r.id}
					/>
					<DataTableCell
						style={{ ...colsStyles.col2 }}
						getContent={(r: (typeof openedBy)[0]) => r.name}
					/>
					<DataTableCell
						style={{ ...colsStyles.col3 }}
						getContent={(r: (typeof openedBy)[0]) => r.designation}
					/>
				</TableBody>
			</Table>
		</View>
	);
}

const openedBy = [
	{
		id: "01",
		name: "Eliman Joof",
		designation: "PROCUREMENT CLERK",
	},
	{
		id: "02",
		name: "Sulayman Sillah",
		designation: "SNR ACCOUNTANT",
	},
	{
		id: "03",
		name: "Yahya Samateh",
		designation: "PTA",
	},
];

const colsStyles = StyleSheet.create({
	col1: {
		maxWidth: 50,

		padding: "3px",
	},
	col2: {
		// width: 25,
		flex: 2,
		padding: "3px",
	},
	col3: {
		width: 1,
		padding: "3px",
		flexBasis: 30,
	},
});
