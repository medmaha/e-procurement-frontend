import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import OpenedBy from './OpenedBy';
import { Form101OpenByProps } from './types';


type Props = {
	openBy: Form101OpenByProps;
};

export default function SupplierSignature(props: Props) {
	return (
		<View style={{ display: "flex", flexDirection: "row", marginTop: 100 }}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					border: 1,
					borderRight: 0,
					width: 230,
				}}
			>
				<View
					style={{
						width: 100,
						height: "100%",
						backgroundColor: "#f2f2f2",
						borderRight: 1,
						display: "flex",
						flexDirection: "row",
						paddingLeft: 5,
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 9 }}>Supplier Signature</Text>
				</View>
				<View style={{ flex: 1, backgroundColor: "#f2f2f2" }}></View>
			</View>
			<OpenedBy {...props.openBy} />
		</View>
	);
}
