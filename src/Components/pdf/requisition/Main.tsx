import React from "react";
import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Approvals from "./Approvals";
import Header from "./Header";
import ItemsTable from "./ItemsTable";

type Props = {
	data: Requisition;
};

export default function MainForm(props: Props) {
	const getTotalSum = () => {
		let sum = 0;
		props.data.items.forEach((item) => {
			sum += Number(item.quantity) * Number(item.unit_cost);
		});
		return sum;
	};
	return (
		<Page style={styles.body}>
			<Header
				identifier={{
					location: "",
					user_department: props.data.officer?.department?.name,
					date: props.data.created_date,
					date_required:
						(props.data as any).required_date ?? new Date().toISOString(),
					requisition_number: props.data.unique_id,
				}}
			/>
			{/* <Notes /> */}
			<View style={{}}>
				<ItemsTable items={props.data.items} />

				{/* <SupplierSignature openBy={props.openedBy} /> */}
			</View>
			<Approvals
				approval={{
					...props.data.approval,
					expenditure_head:
						props.data.approval.finance_approval.expenditure_head?.name,
					total_sum: getTotalSum(),
				}}
				authoredBy={props.data.officer.name}
				remarks={props.data.remarks}
				officer_id={props.data.officer.id}
			/>
			<Text
				style={styles.pageNumber}
				render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
				fixed
			/>
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
});
