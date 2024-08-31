import { ReactNode } from 'react';


type Props = {
	title: string;
	desc: ReactNode;
	content: ReactNode;
	children?: ReactNode;
};

export default function Card(props: Props) {
	return (
		<div className="border-2 p-6 pb-0 relative rounded-lg mt-8 mb-12 bg-card block">
			{/* Title */}
			<h2 className="absolute rounded-t-2xl border-l-2 border-t tracking-wide -top-5 -left-[1px] font-bold text-2xl py-2 px-4 bg-card z-1">
				{props.title}
			</h2>

			{/* Description */}
			<div className="pt-2 pb-4">
				<div className="text-center tracking-wide sm:text-lg">{props.desc}</div>
			</div>

			{/* Content */}
			<div className="pt-5 pb-6">{props.content}</div>

			{props.children}
		</div>
	);
}
