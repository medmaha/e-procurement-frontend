import React from "react";
import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export default function ConditionsAndInstructions() {
	return (
		<View style={styles.body}>
			<View style={styles.main}>
				<View style={styles.section}>
					<Text style={styles.title}>Condition</Text>
					<View>
						<Text style={styles.text}>
							• The General Conditions of Contract for the Procurement of Goods,
							works and services (obtainable from GPPA website www._____) apply
							to this transaction. This form properly submitted constitutes the
							agreement to supply or provide the goods or services shown at the
							prices and within the delivery period stated overleaf.
						</Text>
						<Text style={styles.text}>
							• The offer shall remain valid for 30 days from the closing date
							unless otherwise stipulated by the procuring Organisation.
						</Text>
						<Text style={styles.text}>
							• Procuring Organisation shall not be bound to accept the lowest
							or any other offer.
						</Text>
						<Text style={styles.text}>
							• Procuring Organisation reserves the right to accept any offer in
							part unless the contrary is stipulated by the candidate and is not
							bound to accept the lowest or highest bid.
						</Text>
						<Text style={styles.text}>
							• Samples of offers when required will be provided free and before
							the closing date of the quotation. If not destroyed during tests
							they will, upon request, be returned at the candidate’s expense,
							or may be collected by the owner.
						</Text>
					</View>
				</View>
				<View style={styles.section}>
					<Text style={styles.title}>Instructions</Text>
					<View>
						<Text style={styles.text}>
							1. All entries must be typed or written in ink. Mistakes must not
							be erased but should be crossed out corrections made and initialed
							by persons who are authorized to sign quotations.
						</Text>
						<Text style={styles.text}>
							2. Quote for each item separately, and in units as specified
						</Text>
						<Text style={styles.text}>
							3. This form must be signed by an authorized representative of the
							candidate and preferably it should also be rubber stamped.
						</Text>
						<Text style={styles.text}>
							4. Each quotation should be submitted separately in a plain sealed
							envelope with quotation number endorsed outside. Descriptive
							literature or samples of items offered may be forwarded with the
							quotation.
						</Text>
						<Text style={styles.text}>
							5. If you do not wish to quote, please endorse the reasons on this
							form and return it, otherwise your name may be deleted from the
							procuring Organisation’s mailing list for the items listed hereon.
						</Text>
						<Text style={styles.text}>
							6. By quoting you confirm that you have not engaged in any corrupt
							practices relating to procurement and if found to have done so at
							any time you will be liable for the sanctions contained in the
							Gambia Public Procurement Authority Act, 2014.
						</Text>
					</View>
				</View>
			</View>
			{/* <Text
				style={styles.pageNumber}
				render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
				fixed
			/> */}
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		paddingTop: 15,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	section: {},
	main: {
		display: "flex",
		gap: 50,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		fontFamily: "Oswald",
	},
	text: {
		margin: 12,
		marginBottom: 1,
		fontSize: 9,
		lineHeight: 1.3,
		textAlign: "justify",
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
