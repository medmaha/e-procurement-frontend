import React from 'react';


export default function Page(props: PageProps) {
	return (
		<div>
			Registration Page
			<br />
			<pre>
				<code>{JSON.stringify(props, null, 4)}</code>
			</pre>
		</div>
	);
}
