"use client";

import React, { Children, cloneElement, ReactElement, useMemo } from 'react';
import { View } from '@react-pdf/renderer';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';


const Table = (props: TableProps) => {
	const [tableHeader, tableBody] = useMemo(() => {
		const {
			data = [],
			zebra = false,
			evenRowColor = "",
			oddRowColor = "",
			children,
		} = props;
		let header: ReactElement | null = null;
		let body: ReactElement | null = null;

		Children.forEach(children, (child: React.ReactNode) => {
			const c = child as ReactElement<any>;
			if (c?.type === TableHeader) {
				header = c;
			} else if (c?.type === TableBody) {
				body = c;
				if (body) {
					body = cloneElement(body, {
						data: body.props.data ?? data,
						renderTopBorder: !header,
						zebra: body.props.zebra ?? zebra,
						evenRowColor: body.props.evenRowColor ?? evenRowColor,
						oddRowColor: body.props.oddRowColor ?? oddRowColor,
					});
				}
			}
		});

		return [header, body];
	}, [props]);

	return (
		<View
			style={{
				width: "100%",
			}}
		>
			{tableHeader}
			{tableBody}
		</View>
	);
};

export default Table;
