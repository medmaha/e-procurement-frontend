import { Loader, Loader2 } from 'lucide-react';
import React from 'react';


export default function Loading() {
	return (
		<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
			<div className="max-w-max grid gap-2 mx-auto text-center">
				<Loader2
					className="text-card-foreground animate-spin"
					width={30}
					height={30}
				/>
				{/* <Loader
					className="text-card-foreground animate-spin"
					width={30}
					height={30}
				/> */}
				{/* <p className="text-card-foreground text-2xl font-bold">
					Loading
					<span className="animate-pulse pl-2 inline-block">...</span>
				</p> */}
			</div>
		</div>
	);
}
