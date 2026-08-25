export function GraphsIntroContent() {
  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Different types of graphs can be formed from given data according to the requirement.
        Choose the representation that best matches your data type and the message you want to
        convey.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: 'Bar diagrams',
            text: 'Compare categories using simple, multiple, or sub-divided bars.',
          },
          {
            title: 'Pie graph',
            text: 'Show each category as a portion of a 360° circle.',
          },
          {
            title: 'Histogram',
            text: 'Display frequency distribution for continuous or discrete grouped data.',
          },
          {
            title: 'Frequency tables',
            text: 'Organise raw, categorical, or open data before graphing.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-blue-900">{item.title}</h3>
            <p className="mt-1 text-sm text-academic-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
