import React from 'react';
import Select from 'react-select';


export default function Selector() {
	return (
		<Select
			// defaultValue={[colourOptions[2], colourOptions[3]]}
			isMulti
			name="colors"
			// options={colourOptions}
			className="basic-multi-select"
			classNamePrefix="select"
		/>
	);
}
