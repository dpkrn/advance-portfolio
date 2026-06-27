export default function CustomSection({ section, id }) {
  return (
    <section id={id} className="section-container">
      <h2 className="text-2xl font-bold">{section.title}</h2>
      <pre className="mt-4 p-4 bg-surface-overlay rounded-xl text-sm overflow-auto">
        {JSON.stringify(section.content, null, 2)}
      </pre>
    </section>
  );
}
