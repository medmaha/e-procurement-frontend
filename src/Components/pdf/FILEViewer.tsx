import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

export default function PDFViewer({ src }: any) {
	const viewer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		import("@pdftron/webviewer").then(() => {
			WebViewer(
				{
					path: "/webviewer/lib",
					initialDoc: src,
					licenseKey: "your_license_key", // sign up to get a free trial key at https://dev.apryse.com
				},
				viewer.current!
			).then((instance) => {
				const { Core } = instance;
				const docViewer = Core.documentViewer;
				// you can now call WebViewer APIs here...
			});
		});
	}, [src]);

	return (
		<div className="MyComponent">
			<div className="webviewer h-[100vh]" ref={viewer}></div>
		</div>
	);
}
