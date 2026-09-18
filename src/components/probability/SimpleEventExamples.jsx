import { useMemo, useState } from 'react';
import { formatNum } from '../../utils/formatNumber';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

const selectClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-academic-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

function gcd(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifyFraction(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  const n = Math.trunc(numerator);
  const d = Math.trunc(denominator);
  const g = gcd(n, d);
  return { numerator: n / g, denominator: d / g };
}

function formatFraction(numerator, denominator) {
  const simplified = simplifyFraction(numerator, denominator);
  if (!simplified) return '—';
  return `${simplified.numerator}/${simplified.denominator}`;
}

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{value}</p>
    </div>
  );
}

function resolveEvent(map, eventId, sampleSpace) {
  const entry = map[eventId];
  if (!entry) {
    return { error: 'Choose a valid event from the list.' };
  }
  return { ...entry, sampleSpace };
}

/**
 * Config for each real-world example.
 * `compute(eventId, inputs)` returns { outcomesA, sampleSpace, description } or { error }.
 */
export const SIMPLE_EVENT_EXAMPLES = [
  {
    id: 'coin-one',
    label: 'Flipping a coin',
    events: [
      { id: 'head', label: 'Getting a Head' },
      { id: 'tail', label: 'Getting a Tail' },
    ],
    compute(eventId) {
      return resolveEvent(
        {
          head: {
            outcomesA: 1,
            description: 'Probability of getting Heads when flipping one coin',
          },
          tail: {
            outcomesA: 1,
            description: 'Probability of getting Tails when flipping one coin',
          },
        },
        eventId,
        2,
      );
    },
  },
  {
    id: 'coin-two',
    label: 'Flipping two coins',
    events: [
      { id: 'hh', label: 'Two Heads (HH)' },
      { id: 'tt', label: 'Two Tails (TT)' },
      { id: 'exact-one-head', label: 'Exactly one Head' },
      { id: 'exact-one-tail', label: 'Exactly one Tail' },
      { id: 'at-least-one-head', label: 'At least one Head' },
      { id: 'at-least-one-tail', label: 'At least one Tail' },
      { id: 'same-sides', label: 'Both coins show the same side (HH or TT)' },
      { id: 'different-sides', label: 'Both coins show different sides (HT or TH)' },
    ],
    compute(eventId) {
      return resolveEvent(
        {
          hh: {
            outcomesA: 1,
            description: 'Probability of getting two Heads when flipping two coins',
          },
          tt: {
            outcomesA: 1,
            description: 'Probability of getting two Tails when flipping two coins',
          },
          'exact-one-head': {
            outcomesA: 2,
            description: 'Probability of getting exactly one Head when flipping two coins',
          },
          'exact-one-tail': {
            outcomesA: 2,
            description: 'Probability of getting exactly one Tail when flipping two coins',
          },
          'at-least-one-head': {
            outcomesA: 3,
            description: 'Probability of getting at least one Head when flipping two coins',
          },
          'at-least-one-tail': {
            outcomesA: 3,
            description: 'Probability of getting at least one Tail when flipping two coins',
          },
          'same-sides': {
            outcomesA: 2,
            description: 'Probability both coins show the same side when flipping two coins',
          },
          'different-sides': {
            outcomesA: 2,
            description: 'Probability both coins show different sides when flipping two coins',
          },
        },
        eventId,
        4,
      );
    },
  },
  {
    id: 'coin-three',
    label: 'Flipping three coins',
    events: [
      { id: 'hhh', label: 'Three Heads' },
      { id: 'ttt', label: 'Three Tails' },
      { id: 'exact-two-heads', label: 'Exactly two Heads' },
      { id: 'exact-one-head', label: 'Exactly one Head' },
      { id: 'exact-two-tails', label: 'Exactly two Tails' },
      { id: 'exact-one-tail', label: 'Exactly one Tail' },
      { id: 'at-least-one-head', label: 'At least one Head' },
      { id: 'at-least-two-heads', label: 'At least two Heads' },
      { id: 'at-least-one-tail', label: 'At least one Tail' },
      { id: 'at-least-two-tails', label: 'At least two Tails' },
      { id: 'all-same', label: 'All three coins the same (HHH or TTT)' },
    ],
    compute(eventId) {
      return resolveEvent(
        {
          hhh: {
            outcomesA: 1,
            description: 'Probability of getting three Heads when flipping three coins',
          },
          ttt: {
            outcomesA: 1,
            description: 'Probability of getting three Tails when flipping three coins',
          },
          'exact-two-heads': {
            outcomesA: 3,
            description: 'Probability of getting exactly two Heads when flipping three coins',
          },
          'exact-one-head': {
            outcomesA: 3,
            description: 'Probability of getting exactly one Head when flipping three coins',
          },
          'exact-two-tails': {
            outcomesA: 3,
            description: 'Probability of getting exactly two Tails when flipping three coins',
          },
          'exact-one-tail': {
            outcomesA: 3,
            description: 'Probability of getting exactly one Tail when flipping three coins',
          },
          'at-least-one-head': {
            outcomesA: 7,
            description: 'Probability of getting at least one Head when flipping three coins',
          },
          'at-least-two-heads': {
            outcomesA: 4,
            description: 'Probability of getting at least two Heads when flipping three coins',
          },
          'at-least-one-tail': {
            outcomesA: 7,
            description: 'Probability of getting at least one Tail when flipping three coins',
          },
          'at-least-two-tails': {
            outcomesA: 4,
            description: 'Probability of getting at least two Tails when flipping three coins',
          },
          'all-same': {
            outcomesA: 2,
            description: 'Probability all three coins show the same side',
          },
        },
        eventId,
        8,
      );
    },
  },
  {
    id: 'dice-one',
    label: 'Rolling a dice',
    inputs: [{ key: 'face', label: 'Specific number (1–6)', type: 'number', min: 1, max: 6, default: 4 }],
    events: [
      { id: 'specific', label: 'Getting a specific number', needs: ['face'] },
      { id: 'even', label: 'Even number (2, 4, 6)' },
      { id: 'odd', label: 'Odd number (1, 3, 5)' },
      { id: 'prime', label: 'Prime number (2, 3, 5)' },
      { id: 'composite', label: 'Composite number (4, 6)' },
      { id: 'multiple-of-3', label: 'Multiple of 3 (3, 6)' },
      { id: 'gt3', label: 'Number greater than 3 (4, 5, 6)' },
      { id: 'gt4', label: 'Number greater than 4 (5, 6)' },
      { id: 'lt3', label: 'Number less than 3 (1, 2)' },
      { id: 'lt4', label: 'Number less than 4 (1, 2, 3)' },
      { id: 'leq4', label: 'Number less than or equal to 4 (1–4)' },
    ],
    compute(eventId, inputs) {
      const sampleSpace = 6;
      if (eventId === 'specific') {
        const face = Number(inputs.face);
        if (!Number.isInteger(face) || face < 1 || face > 6) {
          return { error: 'Enter a whole number from 1 to 6 for the specific face.' };
        }
        return {
          outcomesA: 1,
          sampleSpace,
          description: `Probability of getting ${face} when rolling one die`,
        };
      }
      return resolveEvent(
        {
          even: {
            outcomesA: 3,
            description: 'Probability of getting an even number when rolling one die',
          },
          odd: {
            outcomesA: 3,
            description: 'Probability of getting an odd number when rolling one die',
          },
          prime: {
            outcomesA: 3,
            description: 'Probability of getting a prime number when rolling one die',
          },
          composite: {
            outcomesA: 2,
            description: 'Probability of getting a composite number when rolling one die',
          },
          'multiple-of-3': {
            outcomesA: 2,
            description: 'Probability of getting a multiple of 3 when rolling one die',
          },
          gt3: {
            outcomesA: 3,
            description: 'Probability of getting a number greater than 3 when rolling one die',
          },
          gt4: {
            outcomesA: 2,
            description: 'Probability of getting a number greater than 4 when rolling one die',
          },
          lt3: {
            outcomesA: 2,
            description: 'Probability of getting a number less than 3 when rolling one die',
          },
          lt4: {
            outcomesA: 3,
            description: 'Probability of getting a number less than 4 when rolling one die',
          },
          leq4: {
            outcomesA: 4,
            description: 'Probability of getting a number ≤ 4 when rolling one die',
          },
        },
        eventId,
        sampleSpace,
      );
    },
  },
  {
    id: 'dice-two',
    label: 'Rolling two dice',
    inputs: [
      {
        key: 'targetSum',
        label: 'Target sum (2–12)',
        type: 'number',
        min: 2,
        max: 12,
        default: 7,
      },
    ],
    events: [
      { id: 'sum-specific', label: 'Sum equals a specific number', needs: ['targetSum'] },
      { id: 'sum2', label: 'Sum equals 2' },
      { id: 'sum3', label: 'Sum equals 3' },
      { id: 'sum4', label: 'Sum equals 4' },
      { id: 'sum5', label: 'Sum equals 5' },
      { id: 'sum6', label: 'Sum equals 6' },
      { id: 'sum7', label: 'Sum equals 7' },
      { id: 'sum8', label: 'Sum equals 8' },
      { id: 'sum9', label: 'Sum equals 9' },
      { id: 'sum10', label: 'Sum equals 10' },
      { id: 'sum11', label: 'Sum equals 11' },
      { id: 'sum12', label: 'Sum equals 12' },
      { id: 'doubles', label: 'Doubles (both same number)' },
      { id: 'both-even', label: 'Both dice show even numbers' },
      { id: 'both-odd', label: 'Both dice show odd numbers' },
      { id: 'sum-even', label: 'Sum is even' },
      { id: 'sum-odd', label: 'Sum is odd' },
      { id: 'sum-gt8', label: 'Sum greater than 8' },
      { id: 'sum-lt5', label: 'Sum less than 5' },
      { id: 'at-least-one-6', label: 'At least one 6' },
      { id: 'at-least-one-1', label: 'At least one 1' },
    ],
    compute(eventId, inputs) {
      const sampleSpace = 36;
      // Ways to get each sum with two dice
      const sumWays = {
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 5,
        9: 4,
        10: 3,
        11: 2,
        12: 1,
      };

      if (eventId === 'sum-specific') {
        const target = Number(inputs.targetSum);
        if (!Number.isInteger(target) || target < 2 || target > 12) {
          return { error: 'Enter a whole number from 2 to 12 for the target sum.' };
        }
        return {
          outcomesA: sumWays[target],
          sampleSpace,
          description: `Probability that the sum is ${target} when rolling two dice`,
        };
      }

      return resolveEvent(
        {
          sum2: { outcomesA: 1, description: 'Probability that the sum is 2 when rolling two dice' },
          sum3: { outcomesA: 2, description: 'Probability that the sum is 3 when rolling two dice' },
          sum4: { outcomesA: 3, description: 'Probability that the sum is 4 when rolling two dice' },
          sum5: { outcomesA: 4, description: 'Probability that the sum is 5 when rolling two dice' },
          sum6: { outcomesA: 5, description: 'Probability that the sum is 6 when rolling two dice' },
          sum7: { outcomesA: 6, description: 'Probability that the sum is 7 when rolling two dice' },
          sum8: { outcomesA: 5, description: 'Probability that the sum is 8 when rolling two dice' },
          sum9: { outcomesA: 4, description: 'Probability that the sum is 9 when rolling two dice' },
          sum10: {
            outcomesA: 3,
            description: 'Probability that the sum is 10 when rolling two dice',
          },
          sum11: {
            outcomesA: 2,
            description: 'Probability that the sum is 11 when rolling two dice',
          },
          sum12: {
            outcomesA: 1,
            description: 'Probability that the sum is 12 when rolling two dice',
          },
          doubles: {
            outcomesA: 6,
            description: 'Probability of rolling doubles with two dice',
          },
          'both-even': {
            outcomesA: 9,
            description: 'Probability both dice show even numbers when rolling two dice',
          },
          'both-odd': {
            outcomesA: 9,
            description: 'Probability both dice show odd numbers when rolling two dice',
          },
          'sum-even': {
            outcomesA: 18,
            description: 'Probability that the sum is even when rolling two dice',
          },
          'sum-odd': {
            outcomesA: 18,
            description: 'Probability that the sum is odd when rolling two dice',
          },
          'sum-gt8': {
            outcomesA: 10,
            description: 'Probability that the sum is greater than 8 when rolling two dice',
          },
          'sum-lt5': {
            outcomesA: 6,
            description: 'Probability that the sum is less than 5 when rolling two dice',
          },
          'at-least-one-6': {
            outcomesA: 11,
            description: 'Probability of getting at least one 6 when rolling two dice',
          },
          'at-least-one-1': {
            outcomesA: 11,
            description: 'Probability of getting at least one 1 when rolling two dice',
          },
        },
        eventId,
        sampleSpace,
      );
    },
  },
  {
    id: 'cards',
    label: 'Drawing a card from a deck',
    events: [
      { id: 'ace', label: 'Drawing an Ace' },
      { id: 'king', label: 'Drawing a King' },
      { id: 'queen', label: 'Drawing a Queen' },
      { id: 'jack', label: 'Drawing a Jack' },
      { id: 'heart', label: 'Drawing a Heart' },
      { id: 'diamond', label: 'Drawing a Diamond' },
      { id: 'spade', label: 'Drawing a Spade' },
      { id: 'club', label: 'Drawing a Club' },
      { id: 'red', label: 'Drawing a red card (Hearts + Diamonds)' },
      { id: 'black', label: 'Drawing a black card (Clubs + Spades)' },
      { id: 'face', label: 'Drawing a face card (J, Q, K)' },
      { id: 'number', label: 'Drawing a number card (A–10, not face)' },
    ],
    compute(eventId) {
      return resolveEvent(
        {
          ace: {
            outcomesA: 4,
            description: 'Probability of drawing an Ace from a standard deck',
          },
          king: {
            outcomesA: 4,
            description: 'Probability of drawing a King from a standard deck',
          },
          queen: {
            outcomesA: 4,
            description: 'Probability of drawing a Queen from a standard deck',
          },
          jack: {
            outcomesA: 4,
            description: 'Probability of drawing a Jack from a standard deck',
          },
          heart: {
            outcomesA: 13,
            description: 'Probability of drawing a Heart from a standard deck',
          },
          diamond: {
            outcomesA: 13,
            description: 'Probability of drawing a Diamond from a standard deck',
          },
          spade: {
            outcomesA: 13,
            description: 'Probability of drawing a Spade from a standard deck',
          },
          club: {
            outcomesA: 13,
            description: 'Probability of drawing a Club from a standard deck',
          },
          red: {
            outcomesA: 26,
            description: 'Probability of drawing a red card from a standard deck',
          },
          black: {
            outcomesA: 26,
            description: 'Probability of drawing a black card from a standard deck',
          },
          face: {
            outcomesA: 12,
            description: 'Probability of drawing a face card (J, Q, or K) from a standard deck',
          },
          number: {
            outcomesA: 40,
            description: 'Probability of drawing a number card (not a face card) from a standard deck',
          },
        },
        eventId,
        52,
      );
    },
  },
  {
    id: 'color-wheel',
    label: 'Spinning a color wheel',
    inputs: [
      {
        key: 'colors',
        label: 'Number of colors',
        type: 'select',
        options: [
          { value: '4', label: '4 colors' },
          { value: '5', label: '5 colors' },
          { value: '6', label: '6 colors' },
        ],
        default: '4',
      },
    ],
    events: [
      { id: 'specific-color', label: 'Landing on a specific color', needs: ['colors'] },
      { id: 'not-specific-color', label: 'Not landing on a specific color', needs: ['colors'] },
    ],
    compute(eventId, inputs) {
      const n = Number(inputs.colors);
      if (![4, 5, 6].includes(n)) {
        return { error: 'Choose 4, 5, or 6 colors on the wheel.' };
      }
      if (eventId === 'specific-color') {
        return {
          outcomesA: 1,
          sampleSpace: n,
          description: `Probability of landing on a specific color on a ${n}-color wheel`,
        };
      }
      if (eventId === 'not-specific-color') {
        return {
          outcomesA: n - 1,
          sampleSpace: n,
          description: `Probability of not landing on a specific color on a ${n}-color wheel`,
        };
      }
      return { error: 'Choose a valid event from the list.' };
    },
  },
  {
    id: 'coin-dice',
    label: 'Flipping a coin with a dice',
    inputs: [{ key: 'face', label: 'Specific number (1–6)', type: 'number', min: 1, max: 6, default: 4 }],
    events: [
      { id: 'head-specific', label: 'Head and a specific number', needs: ['face'] },
      { id: 'tail-specific', label: 'Tail and a specific number', needs: ['face'] },
      { id: 'head-even', label: 'Head and an even number' },
      { id: 'head-odd', label: 'Head and an odd number' },
      { id: 'tail-even', label: 'Tail and an even number' },
      { id: 'tail-odd', label: 'Tail and an odd number' },
      { id: 'head-gt4', label: 'Head and number greater than 4' },
      { id: 'tail-gt4', label: 'Tail and number greater than 4' },
      { id: 'any-head', label: 'Any Head result (Head + any of 1–6)' },
      { id: 'any-tail', label: 'Any Tail result (Tail + any of 1–6)' },
    ],
    compute(eventId, inputs) {
      const sampleSpace = 12;
      if (eventId === 'head-specific' || eventId === 'tail-specific') {
        const face = Number(inputs.face);
        if (!Number.isInteger(face) || face < 1 || face > 6) {
          return { error: 'Enter a whole number from 1 to 6 for the specific face.' };
        }
        const side = eventId === 'head-specific' ? 'Head' : 'Tail';
        return {
          outcomesA: 1,
          sampleSpace,
          description: `Probability of getting ${side} and ${face} when flipping a coin with a die`,
        };
      }
      return resolveEvent(
        {
          'head-even': {
            outcomesA: 3,
            description: 'Probability of Head and an even number when flipping a coin with a die',
          },
          'head-odd': {
            outcomesA: 3,
            description: 'Probability of Head and an odd number when flipping a coin with a die',
          },
          'tail-even': {
            outcomesA: 3,
            description: 'Probability of Tail and an even number when flipping a coin with a die',
          },
          'tail-odd': {
            outcomesA: 3,
            description: 'Probability of Tail and an odd number when flipping a coin with a die',
          },
          'head-gt4': {
            outcomesA: 2,
            description:
              'Probability of Head and a number greater than 4 when flipping a coin with a die',
          },
          'tail-gt4': {
            outcomesA: 2,
            description:
              'Probability of Tail and a number greater than 4 when flipping a coin with a die',
          },
          'any-head': {
            outcomesA: 6,
            description: 'Probability of any Head result when flipping a coin with a die',
          },
          'any-tail': {
            outcomesA: 6,
            description: 'Probability of any Tail result when flipping a coin with a die',
          },
        },
        eventId,
        sampleSpace,
      );
    },
  },
  {
    id: 'balls',
    label: 'Colored balls in a box',
    inputs: [
      { key: 'red', label: 'Red balls', type: 'number', min: 0, default: 3 },
      { key: 'blue', label: 'Blue balls', type: 'number', min: 0, default: 4 },
      { key: 'green', label: 'Green balls (optional)', type: 'number', min: 0, default: 0 },
    ],
    events: [
      { id: 'red', label: 'Drawing a Red ball', needs: ['red', 'blue', 'green'] },
      { id: 'blue', label: 'Drawing a Blue ball', needs: ['red', 'blue', 'green'] },
      { id: 'green', label: 'Drawing a Green ball', needs: ['red', 'blue', 'green'] },
      { id: 'not-red', label: 'Drawing a ball that is not Red', needs: ['red', 'blue', 'green'] },
      { id: 'not-blue', label: 'Drawing a ball that is not Blue', needs: ['red', 'blue', 'green'] },
      { id: 'not-green', label: 'Drawing a ball that is not Green', needs: ['red', 'blue', 'green'] },
    ],
    compute(eventId, inputs) {
      const red = Number(inputs.red);
      const blue = Number(inputs.blue);
      const green = Number(inputs.green);
      if (![red, blue, green].every((n) => Number.isInteger(n) && n >= 0)) {
        return { error: 'Ball counts must be whole numbers ≥ 0.' };
      }
      const total = red + blue + green;
      if (total === 0) {
        return { error: 'Total number of balls cannot be zero.' };
      }

      const counts = {
        red,
        blue,
        green,
        'not-red': total - red,
        'not-blue': total - blue,
        'not-green': total - green,
      };
      if (!(eventId in counts)) {
        return { error: 'Choose a valid event from the list.' };
      }

      const labels = {
        red: 'a Red ball',
        blue: 'a Blue ball',
        green: 'a Green ball',
        'not-red': 'a ball that is not Red',
        'not-blue': 'a ball that is not Blue',
        'not-green': 'a ball that is not Green',
      };

      return {
        outcomesA: counts[eventId],
        sampleSpace: total,
        description: `Probability of drawing ${labels[eventId]} from a box with ${red} red, ${blue} blue, and ${green} green balls`,
      };
    },
  },
  {
    id: 'numbers',
    label: 'Set of numbers (Even, Odd, Prime)',
    events: [
      { id: 'even', label: 'Even number (2, 4, 6, 8, 10)' },
      { id: 'odd', label: 'Odd number (1, 3, 5, 7, 9)' },
      { id: 'prime', label: 'Prime number (2, 3, 5, 7)' },
      { id: 'composite', label: 'Composite number (4, 6, 8, 9, 10)' },
      { id: 'multiple-of-3', label: 'Multiple of 3 (3, 6, 9)' },
      { id: 'multiple-of-5', label: 'Multiple of 5 (5, 10)' },
      { id: 'gt5', label: 'Number greater than 5 (6–10)' },
      { id: 'lt5', label: 'Number less than 5 (1–4)' },
      { id: 'leq5', label: 'Number less than or equal to 5 (1–5)' },
    ],
    compute(eventId) {
      return resolveEvent(
        {
          even: {
            outcomesA: 5,
            description: 'Probability of picking an even number from {1, 2, …, 10}',
          },
          odd: {
            outcomesA: 5,
            description: 'Probability of picking an odd number from {1, 2, …, 10}',
          },
          prime: {
            outcomesA: 4,
            description: 'Probability of picking a prime number from {1, 2, …, 10}',
          },
          composite: {
            outcomesA: 5,
            description: 'Probability of picking a composite number from {1, 2, …, 10}',
          },
          'multiple-of-3': {
            outcomesA: 3,
            description: 'Probability of picking a multiple of 3 from {1, 2, …, 10}',
          },
          'multiple-of-5': {
            outcomesA: 2,
            description: 'Probability of picking a multiple of 5 from {1, 2, …, 10}',
          },
          gt5: {
            outcomesA: 5,
            description: 'Probability of picking a number greater than 5 from {1, 2, …, 10}',
          },
          lt5: {
            outcomesA: 4,
            description: 'Probability of picking a number less than 5 from {1, 2, …, 10}',
          },
          leq5: {
            outcomesA: 5,
            description: 'Probability of picking a number ≤ 5 from {1, 2, …, 10}',
          },
        },
        eventId,
        10,
      );
    },
  },
  {
    id: 'class',
    label: 'A class of boys and girls with a trait',
    inputs: [
      { key: 'boys', label: 'Number of boys', type: 'number', min: 0, default: 15 },
      { key: 'girls', label: 'Number of girls', type: 'number', min: 0, default: 15 },
      {
        key: 'trait',
        label: 'Students with the trait (e.g. brown eyes)',
        type: 'number',
        min: 0,
        default: 8,
      },
    ],
    events: [
      { id: 'boy', label: 'Selecting a boy', needs: ['boys', 'girls', 'trait'] },
      { id: 'girl', label: 'Selecting a girl', needs: ['boys', 'girls', 'trait'] },
      { id: 'trait', label: 'Selecting a student with the trait', needs: ['boys', 'girls', 'trait'] },
      {
        id: 'no-trait',
        label: 'Selecting a student without the trait',
        needs: ['boys', 'girls', 'trait'],
      },
    ],
    compute(eventId, inputs) {
      const boys = Number(inputs.boys);
      const girls = Number(inputs.girls);
      const trait = Number(inputs.trait);
      if (![boys, girls, trait].every((n) => Number.isInteger(n) && n >= 0)) {
        return { error: 'Counts must be whole numbers ≥ 0.' };
      }
      const total = boys + girls;
      if (total === 0) {
        return { error: 'Class size (boys + girls) cannot be zero.' };
      }
      if (trait > total) {
        return { error: 'Students with the trait cannot exceed the class size.' };
      }

      if (eventId === 'boy') {
        return {
          outcomesA: boys,
          sampleSpace: total,
          description: `Probability of selecting a boy from a class of ${boys} boys and ${girls} girls`,
        };
      }
      if (eventId === 'girl') {
        return {
          outcomesA: girls,
          sampleSpace: total,
          description: `Probability of selecting a girl from a class of ${boys} boys and ${girls} girls`,
        };
      }
      if (eventId === 'trait') {
        return {
          outcomesA: trait,
          sampleSpace: total,
          description: `Probability of selecting a student with the trait from a class of ${total} students`,
        };
      }
      if (eventId === 'no-trait') {
        return {
          outcomesA: total - trait,
          sampleSpace: total,
          description: `Probability of selecting a student without the trait from a class of ${total} students`,
        };
      }
      return { error: 'Choose a valid event from the list.' };
    },
  },
];

function defaultInputsFor(example) {
  const defaults = {};
  for (const input of example.inputs ?? []) {
    defaults[input.key] = String(input.default ?? '');
  }
  return defaults;
}

function visibleInputs(example, eventId) {
  const event = example.events.find((e) => e.id === eventId);
  if (!event?.needs?.length) {
    if (example.id === 'color-wheel') return example.inputs ?? [];
    if (example.id === 'balls') return example.inputs ?? [];
    if (example.id === 'class') return example.inputs ?? [];
    return [];
  }
  return (example.inputs ?? []).filter((input) => event.needs.includes(input.key));
}

export function SimpleEventExamples() {
  const [exampleId, setExampleId] = useState(SIMPLE_EVENT_EXAMPLES[0].id);
  const example = SIMPLE_EVENT_EXAMPLES.find((e) => e.id === exampleId) ?? SIMPLE_EVENT_EXAMPLES[0];

  const [eventId, setEventId] = useState(example.events[0].id);
  const [inputs, setInputs] = useState(() => defaultInputsFor(example));

  const handleExampleChange = (nextId) => {
    const next = SIMPLE_EVENT_EXAMPLES.find((e) => e.id === nextId) ?? SIMPLE_EVENT_EXAMPLES[0];
    setExampleId(next.id);
    setEventId(next.events[0].id);
    setInputs(defaultInputsFor(next));
  };

  const handleEventChange = (nextEventId) => {
    setEventId(nextEventId);
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => {
    if (!example || !eventId) return null;
    return example.compute(eventId, inputs);
  }, [example, eventId, inputs]);

  const inputsToShow = visibleInputs(example, eventId);
  const probability =
    result && !result.error && result.sampleSpace > 0
      ? result.outcomesA / result.sampleSpace
      : null;
  const fractionLabel =
    result && !result.error ? formatFraction(result.outcomesA, result.sampleSpace) : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label htmlFor="simple-event-example" className="mb-1 block text-sm font-medium text-blue-900">
            Examples of simple events
          </label>
          <select
            id="simple-event-example"
            className={selectClass}
            value={exampleId}
            onChange={(e) => handleExampleChange(e.target.value)}
          >
            {SIMPLE_EVENT_EXAMPLES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label htmlFor="simple-event-choice" className="mb-1 block text-sm font-medium text-blue-900">
            Choose an event
          </label>
          <select
            id="simple-event-choice"
            className={selectClass}
            value={eventId}
            onChange={(e) => handleEventChange(e.target.value)}
          >
            {example.events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {inputsToShow.length > 0 && (
        <div
          className={`grid gap-4 ${
            inputsToShow.length === 1
              ? 'max-w-xs'
              : inputsToShow.length === 2
                ? 'max-w-md sm:grid-cols-2'
                : 'sm:grid-cols-3'
          }`}
        >
          {inputsToShow.map((input) => (
            <div key={input.key} className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label
                htmlFor={`simple-event-input-${input.key}`}
                className="mb-1 block text-sm font-medium text-blue-900"
              >
                {input.label}
              </label>
              {input.type === 'select' ? (
                <select
                  id={`simple-event-input-${input.key}`}
                  className={selectClass}
                  value={inputs[input.key] ?? ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                >
                  {input.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`simple-event-input-${input.key}`}
                  type="number"
                  min={input.min}
                  max={input.max}
                  className={inputClass}
                  value={inputs[input.key] ?? ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && probability !== null && (
        <div className="space-y-3">
          <p className="text-center text-sm text-academic-700">{result.description}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard label="Outcomes of event A" value={String(result.outcomesA)} />
            <ResultCard label="Sample space outcomes" value={String(result.sampleSpace)} />
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
              <p className="text-xs font-medium text-blue-700">P(A)</p>
              <p className="mt-1 text-xl font-bold text-blue-900 sm:text-2xl">
                {fractionLabel} = {formatNum(probability, 6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
