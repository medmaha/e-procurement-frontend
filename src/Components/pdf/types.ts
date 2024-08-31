interface TableProps {
	data?: any[];
	zebra?: boolean;
	evenRowColor?: string;
	oddRowColor?: string;
	children: React.ReactNode;
}

/**
 * Whether to include borders or not.
 * Depending on the context some toggles will not have any effect.
 */
interface TableBorder {
	/**
	 * Include the top border. Default true.
	 */
	includeTopBorder?: boolean;

	/**
	 * Include the right border. Default true.
	 */
	includeRightBorder?: boolean;

	/**
	 * Include the bottom border. Default true.
	 */
	includeBottomBorder?: boolean;

	/**
	 * Include the left border. Default true.
	 */
	includeLeftBorder?: boolean;

	children?: any;
}

interface TableCellProps extends TableBorder {
	/**
	 * The weighting of a cell based on the flex layout style.
	 * This value is between 0..1, if not specified 1 is assumed, this will take up the remaining available space.
	 */
	weighting?: number;

	/**
	 * Extra styling to apply. These will override existing style with the same key.
	 */
	// @ts-ignore
	style?: ReactPDF.Style | ReactPDF.Style[];

	/**
	 * How to align the text
	 */
	textAlign?: "left" | "center" | "right";

	/**
	 * Whether this is a header cell or not. If not defined it will be false.
	 */
	isHeader?: boolean;

	/**
	 * The font-size to apply to the cell.
	 */
	fontSize?: number | string;
}

interface DataTableCellProps extends TableCellProps {
	/**
	 * The data associated with the cell.
	 */
	data?: any;

	/**
	 * The content to display for this cell.
	 * @param data the data passed in.
	 */
	getContent: (data: any) => React.ReactNode | JSX.Element | string | number;
}

interface TableRowProps extends TableBorder {
	/**
	 * The font size as a valid unit defined in react-pdf.
	 */
	fontSize?: number | string;

	/**
	 * The index of the row.
	 */
	index?: number;

	/**
	 * Whether to align the text. Defaults to left.
	 */
	textAlign?: "left" | "center" | "right";

	/**
	 * Any data associated, relevant if the parent is a {@see DataTableCell}.
	 */
	data?: any;

	/**
	 * Whether rows have alternating styles
	 */
	zebra?: boolean;

	/**
	 * Whether this row is even (true) or odd (false)
	 */
	even?: boolean;

	/**
	 * Specify the color of even rows
	 */
	evenRowColor?: string;

	/**
	 * Specify the color of odd rows
	 */
	oddRowColor?: string;
}

interface TableBodyProps extends TableRowProps {
	/**
	 * The data associated with the table.
	 */
	data?: any[];
	zebra?: boolean;
}

interface DataTableCellProps extends TableCellProps {
	/**
	 * The data associated with the cell.
	 */
	data?: any;

	/**
	 * The content to display for this cell.
	 * @param data the data passed in.
	 */
	index?:number
	getContent: (data: any) => React.ReactNode | JSX.Element | string | number;
}

// This  interface adds a flag to indicate if we should render the top border,
// thus allowing us to render it in the event that no
// header rows were present in the table.
interface InternalBodyProps extends TableBodyProps {
	renderTopBorder?: boolean;
}

interface TableHeaderProps extends TableRowProps {
	children: any;
}
