import React from "react";
import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DataTableCell } from "../../pdf/DataTableCell";
import Table from "../../pdf/Table";
import { TableBody } from "../../pdf/TableBody";
import { TableCell } from "../../pdf/TableCell";
import { TableHeader } from "../../pdf/TableHeader";
import GrandTotal from "./GrandTotal";
import Header from "./Header";
import ItemsTable from "./ItemsTable";
import Notes from "./Notes";
import SupplierSignature from "./SupplierSignature";
import {
	Form101HeaderProps,
	Form101OpenByProps,
	Form101RFQItemsProps,
} from "./types";

type Props = {
	header: Form101HeaderProps;
	items: Form101RFQItemsProps;
	openedBy: Form101OpenByProps;
	children: any;
};

export default function MainForm(props: Props) {
	const isRFQ = props.header.isRFQ;
	return (
		<Page style={styles.body} wrap={true}>
			<Header {...props.header} />
			{!isRFQ && <Notes deadline={props.header.deadline} />}
			<View style={{}}>
				<ItemsTable {...props.items} />
				<View style={{ display: "flex", flexDirection: "row" }}>
					{/* Official Use Only TAG */}
					<View
						style={{
							width: "61.1%",
							borderLeft: 1,
							borderBottom: 1,
							borderColor: "#222",
							borderStyle: "solid",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontSize: 9,
								height: 21,
								paddingTop: 6,
							}}
						>
							Official Use Only
						</Text>
					</View>
					<GrandTotal />
				</View>
				{!isRFQ && <SupplierSignature openBy={props.openedBy} />}
			</View>
			{isRFQ && props.openedBy.suppliers && (
				<View
					style={{
						flex: 1,
						marginTop: 20,
						minHeight: 200,
						fontFamily: "Times-Roman",
					}}
				>
					<Text
						style={{
							fontStyle: "Oswald",
							marginBottom: 9,
							fontSize: 12,
							width: "100%",
						}}
					>
						Suppliers
					</Text>
					<Table
						data={[
							...props.openedBy.suppliers,
							...new Array(5 - props.openedBy.suppliers.length).fill({}),
						]}
					>
						<TableHeader>
							<TableCell
								style={[{ fontSize: 8 }, styles.heading, styles.index]}
							>
								No.
							</TableCell>
							<TableCell
								style={[{ fontSize: 8 }, styles.heading, styles.index2]}
							>
								Supplier ID
							</TableCell>
							<TableCell style={[{ fontSize: 8 }, styles.heading]}>
								Contact Person
							</TableCell>
							<TableCell style={[{ fontSize: 8 }, styles.heading]}>
								Supplier Name
							</TableCell>
							<TableCell style={[{ fontSize: 8 }, styles.heading]}>
								Supplier Address
							</TableCell>
						</TableHeader>
						<TableBody>
							{[props.openedBy.suppliers[0]].map((row, rowIndex) =>
								Object.keys(row).map((key, colIndex) => (
									<DataTableCell
										key={colIndex}
										style={[
											{ padding: "10px" },
											styles.text,
											colIndex === 0 ? styles.index : {},
											colIndex === 1 ? styles.index2 : {},
										]}
										getContent={(r) => (colIndex === 0 ? r.index + 1 : r[key])}
									/>
								))
							)}
						</TableBody>
					</Table>
				</View>
			)}
			<Text
				style={styles.pageNumber}
				render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
				fixed
			/>
			{props.children}
		</Page>
	);
}

const styles = StyleSheet.create({
	body: {
		paddingTop: 25,
		paddingBottom: 65,
		paddingHorizontal: 20,
		fontFamily: "Times-Roman",
	},
	pageNumber: {
		position: "absolute",
		fontSize: 10,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
	heading: {
		fontWeight: "bold",
		padding: 5,
		paddingRight: 0,
		fontSize: 9,
		fontFamily: "Oswald",
		// fontFamily: "Times-Roman",
	},
	text: {
		fontFamily: "Times-Roman",
		padding: 5,
		paddingRight: 0,
		fontSize: 8,
	},
	index: {
		width: 20,
		maxWidth: 40,
	},
	index2: {
		width: 30,
		maxWidth: 60,
	},
});
