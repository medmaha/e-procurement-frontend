import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';


export default function Notes() {
	return (
		<View style={styles.main}>
			<Text style={{ ...styles.bold, fontSize: 10 }}>NOTES:</Text>
			<Text>
				You are invited to submit quotation for goods as listed below:
			</Text>
			<View
				style={{
					display: "flex",
					alignItems: "center",
					gap: 3,
					flexDirection: "row",
				}}
			>
				<Text>a.</Text>
				<Text>
					<Text style={styles.bold}>THIS IS NOT AN ORDER.</Text>
				</Text>
				<Text>
					Read the conditions and instructions on reverse before quoting.
				</Text>
			</View>
			<Text>
				b. Your quotation should indicate Final unit Prices which includes all
				applicable taxes, delivery charges, discounts charges etc.
			</Text>
			<Text style={styles.bold}>
				c. Supplier completes shaded sections only
			</Text>
			<Text>
				d. Return the original copy and retain the duplicate for your record.
			</Text>

			<Text style={styles.text}>
				e. This quotation should be submitted in a plain sealed envelope marked
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		fontSize: 9,
		marginBottom: 30,
		paddingLeft: 15,
		paddingRight: 30,
		display: "flex",
		flexDirection: "column",
		gap: 1,
	},
	text: {
		width: 410,
	},
	bold: {
		fontFamily: "Oswald",
	},
});
