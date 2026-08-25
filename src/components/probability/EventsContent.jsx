import { FormulaBox } from '../FormulaBox';

const eventTypes = [
  {
    title: 'Simple event',
    description:
      'An event with a single outcome in the sample space. Apply the probability formula directly.',
  },
  {
    title: 'Compound event',
    description:
      'An event formed from two or more simple events. Use combinations to count outcomes for each part. Add outcomes for OR; multiply for AND.',
  },
  {
    title: 'Mutually exclusive event',
    description:
      'Events that cannot occur together (no overlap). P(A ∪ B) = P(A) + P(B).',
  },
  {
    title: 'Not mutually exclusive event',
    description:
      'Events that can occur together. P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
  },
];

export function EventsContent() {
  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Any subset of the sample space is called an <strong>event</strong>. The number of outcomes
        of an event is usually calculated using combinations. Before finding probability, identify
        the event type, then solve accordingly.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {eventTypes.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-blue-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-academic-600">{item.description}</p>
          </div>
        ))}
      </div>

      <FormulaBox label="Compound events">
        <div className="flex flex-col gap-2 text-base sm:text-lg">
          <span>OR (A or B): add the number of outcomes of each part</span>
          <span>AND (A and B): multiply the number of outcomes of each part</span>
        </div>
      </FormulaBox>

      <div className="rounded-lg border border-academic-200 bg-academic-50 px-4 py-3 text-sm text-academic-700">
        <p className="font-semibold text-blue-900">How to proceed</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Simple event → apply P(A) directly.</li>
          <li>Compound event → count outcomes with combinations, then add (OR) or multiply (AND).</li>
          <li>Mutually exclusive → use P(A) + P(B) for the union.</li>
          <li>Not mutually exclusive → subtract the overlap: P(A) + P(B) − P(A ∩ B).</li>
        </ul>
      </div>
    </section>
  );
}
