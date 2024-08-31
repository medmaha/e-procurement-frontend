import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';


export default function GrandTotal() {
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					border: 1,
					height: 22,
					borderTop: 0,
				}}
			>
				<View
					style={{
						...styles.column,
						fontFamily: "Oswald",
						fontSize: 8,
						textAlign: "center",
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "center",
						backgroundColor: "#f2f2f2",
					}}
				>
					<Text>Grand Total</Text>
				</View>
				<View
					style={{
						...styles.column,
					}}
				></View>
				<View style={{ flex: 1, backgroundColor: "#f2f2f2" }}></View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	column: {
		width: 44,
		borderRight: 1,
		backgroundColor: "#f2f2f2",
	},
});
