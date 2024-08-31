export default function Page(props: PageProps) {
	const slug = props.params.slug;
	return (
		<section className="section">
			<div className="section-heading">{slug}</div>
		</section>
	);
}
