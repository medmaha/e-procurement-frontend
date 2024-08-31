import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Form101HeaderProps } from "./types";

export default function Header(props: Form101HeaderProps) {
	const isRFQ = props.isRFQ;
	return (
		<View style={styles.header}>
			{!isRFQ && (
				<View style={styles.col1}>
					<View style={styles.flexRow}>
						<Text style={{ fontSize: 7 }}>To:</Text>
						<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
							{props.to}
						</Text>
					</View>
					<View style={styles.flexRow}>
						<Text style={{ fontSize: 7 }}>Address:</Text>
						<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
							{props.toLocation}
						</Text>
					</View>
					<View style={styles.flexRow}>
						<Text style={{ fontSize: 7 }}>RFQ ID:</Text>
						<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
							{props.rfq_id}
						</Text>
					</View>
				</View>
			)}

			<View style={styles.col2}>
				{isRFQ ? "IS RFQ" : "Not RFQ"}
				<View>
					<Text style={styles.col2_title}>
						{props.title ?? "GPPA FORM – 101--REQUESTS FOR QUOTATION"}
					</Text>
				</View>
				<View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
					<View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
						{/* <Text>Quotation No: RFQ/MISCELLANEOUS </Text> */}
						<Text>
							{props.quotation_no.startsWith("RFQ") ? "RFQ " : "Quotation "}No:{" "}
							{props.quotation_no}
						</Text>
						<Text>OFFICE EXPENSES / {props.office_expenses}</Text>
					</View>
					<View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
						<Text>GPPA Reg. No. {props.gppaNumber} </Text>
						<Text>Date: {format(new Date(props.date), "PPP")}</Text>
					</View>
					{isRFQ && (
						<View style={styles.flexRow}>
							<Text style={{ fontSize: 7 }}>Deadline:</Text>
							<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
								{format(new Date(props.deadline), "PPPp")}
							</Text>
						</View>
					)}
				</View>
			</View>
			{isRFQ && (
				<View>
					<View style={styles.flexRow}>
						<Text style={{ fontSize: 7 }}>Authorized by:</Text>
						<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
							{props.authorizedBy}
						</Text>
					</View>
					<View style={[styles.flexRow, { opacity: 0.6, marginTop: 2 }]}>
						<Text style={{ fontSize: 7 }}>Employer ID:</Text>
						<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
							EMP0014040
						</Text>
					</View>
				</View>
			)}
			{!isRFQ && (
				<View style={styles.col3}>
					<View
						style={{
							border: "1pt solid black",
							textAlign: "right",
							padding: "3px",
							width: "60px",
							opacity: 0.7,
						}}
					>
						<Text>{"[GPPR 118(2)]"}</Text>
					</View>
					<View style={styles.col3_items}>
						<View style={styles.flexRow}>
							<Text style={{ fontSize: 7 }}>From:</Text>
							<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
								{props.from}
							</Text>
						</View>
						<View style={styles.flexRow}>
							<Text style={{ fontSize: 7 }}>Address:</Text>
							<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
								{props.fromLocation}
							</Text>
						</View>
						<View style={styles.flexRow}>
							<Text style={{ fontSize: 7 }}>Authorized by:</Text>
							<Text style={{ fontSize: 7, fontFamily: "Oswald" }}>
								{props.authorizedBy}
							</Text>
						</View>
						<Text style={{ marginTop: 2 }}>(signature) …………………………</Text>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		display: "flex",
		justifyContent: "space-between",
		gap: 2,
		flexDirection: "row",
		margin: "10px",
		fontFamily: "Times-Roman",
	},
	col1: {
		fontSize: 7,
		// flex: 1,
	},
	col2: {
		fontSize: 7,
		display: "flex",
		flexDirection: "column",
		gap: "5px",
	},
	col2_title: {
		fontSize: 9,
		fontFamily: "Oswald",
	},
	col3: {
		display: "flex",
		flexDirection: "column",
		gap: "5px",
		alignItems: "flex-end",
		fontSize: 7,
	},
	col3_items: {
		width: "110px",
		flexDirection: "column",
		gap: 1,
	},
	flexRow: {
		display: "flex",
		flexDirection: "row",
		gap: 5,
		alignItems: "center",
	},
});
