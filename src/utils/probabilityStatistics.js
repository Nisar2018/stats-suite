import { formatNum } from './formatNumber';

const MAX_FACTORIAL = 170;

export function computeFactorial(n) {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 0) {
    return { error: 'Enter a whole number n ≥ 0.' };
  }
  if (num > MAX_FACTORIAL) {
    return { error: `n is too large to compute exactly (max ${MAX_FACTORIAL}).` };
  }

  if (num === 0 || num === 1) {
    return {
      n: num,
      result: 1,
      factors: num === 0 ? ['1 (by definition: 0! = 1)'] : ['1'],
      steps: [
        {
          step: 1,
          title: 'Factorial formula',
          content: `${num}! = ${num === 0 ? '1 (by definition)' : '1 = 1'}`,
        },
      ],
    };
  }

  const factors = [];
  let product = 1;
  for (let i = num; i >= 1; i--) {
    factors.push(i);
    product *= i;
  }

  return {
    n: num,
    result: product,
    factors,
    expansion: factors.join(' × '),
    steps: [
      {
        step: 1,
        title: 'Write the product',
        content: `${num}! = ${factors.join(' × ')}`,
      },
      {
        step: 2,
        title: 'Multiply',
        content: `${num}! = ${formatNum(product, 0)}`,
      },
    ],
  };
}

export function computePermutation(n, r) {
  const N = Number(n);
  const R = Number(r);
  if (!Number.isInteger(N) || !Number.isInteger(R) || N < 0 || R < 0) {
    return { error: 'Enter whole numbers for n and r.' };
  }
  if (R > N) {
    return { error: 'r cannot be greater than n.' };
  }

  const nFact = computeFactorial(N);
  const nrFact = computeFactorial(N - R);
  if (nFact.error || nrFact.error) return nFact.error ? nFact : nrFact;

  const result = nFact.result / nrFact.result;

  return {
    n: N,
    r: R,
    nFactorial: nFact.result,
    nrFactorial: nrFact.result,
    result,
    steps: [
      {
        step: 1,
        title: 'Permutation formula',
        content: `${N}P${R} = ${N}! / (${N} − ${R})! = ${N}! / ${N - R}!`,
      },
      {
        step: 2,
        title: 'Substitute factorials',
        content: `${N}P${R} = ${formatNum(nFact.result, 0)} / ${formatNum(nrFact.result, 0)}`,
      },
      {
        step: 3,
        title: 'Result',
        content: `${N}P${R} = ${formatNum(result, 0)}`,
      },
    ],
  };
}

export function computeCombination(n, r) {
  const N = Number(n);
  const R = Number(r);
  if (!Number.isInteger(N) || !Number.isInteger(R) || N < 0 || R < 0) {
    return { error: 'Enter whole numbers for n and r.' };
  }
  if (R > N) {
    return { error: 'r cannot be greater than n.' };
  }

  const nFact = computeFactorial(N);
  const rFact = computeFactorial(R);
  const nrFact = computeFactorial(N - R);
  if (nFact.error || rFact.error || nrFact.error) {
    return nFact.error ? nFact : rFact.error ? rFact : nrFact;
  }

  const result = nFact.result / (rFact.result * nrFact.result);

  return {
    n: N,
    r: R,
    nFactorial: nFact.result,
    rFactorial: rFact.result,
    nrFactorial: nrFact.result,
    result,
    steps: [
      {
        step: 1,
        title: 'Combination formula',
        content: `${N}C${R} = ${N}! / (${R}! × (${N} − ${R})!)`,
      },
      {
        step: 2,
        title: 'Substitute factorials',
        content: `${N}C${R} = ${formatNum(nFact.result, 0)} / (${formatNum(rFact.result, 0)} × ${formatNum(nrFact.result, 0)})`,
      },
      {
        step: 3,
        title: 'Result',
        content: `${N}C${R} = ${formatNum(result, 0)}`,
      },
    ],
  };
}

/** Sample space size = n1 × n2 × … */
export function computeSampleSpace(outcomeCounts) {
  const counts = outcomeCounts
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0 && Number.isInteger(n));

  if (!counts.length) {
    return { error: 'Enter at least one positive whole number of outcomes.' };
  }

  const result = counts.reduce((p, c) => p * c, 1);
  const labels = counts.map((_, i) => `n${i + 1}`);

  return {
    counts,
    labels,
    result,
    expression: labels.join(' × '),
    steps: [
      {
        step: 1,
        title: 'List outcome counts',
        content: counts.map((c, i) => `n${i + 1} = ${c}`).join(', '),
      },
      {
        step: 2,
        title: 'Multiply outcomes',
        content: `S = ${counts.join(' × ')} = ${formatNum(result, 0)}`,
      },
    ],
  };
}

/** P(A) = favorable / sample space */
export function computeProbability(favorable, sampleSpace) {
  const f = Number(favorable);
  const s = Number(sampleSpace);
  if (!Number.isFinite(f) || !Number.isFinite(s) || f < 0 || s <= 0) {
    return { error: 'Enter valid non-negative favorable outcomes and positive sample space.' };
  }
  if (f > s) {
    return { error: 'Event outcomes cannot exceed sample space outcomes.' };
  }

  const probability = f / s;

  return {
    favorable: f,
    sampleSpace: s,
    probability,
    steps: [
      {
        step: 1,
        title: 'Probability formula',
        content: 'P(A) = (no. of outcomes of event A) / (no. of outcomes of sample space)',
      },
      {
        step: 2,
        title: 'Substitute values',
        content: `P(A) = ${formatNum(f, 0)} / ${formatNum(s, 0)} = ${formatNum(probability, 6)}`,
      },
    ],
  };
}

/** P(A ∪ B) for mutually exclusive or not */
export function computeUnionProbability(pA, pB, pIntersection, mutuallyExclusive) {
  const a = Number(pA);
  const b = Number(pB);
  const ab = Number(pIntersection);
  if (![a, b].every((x) => Number.isFinite(x) && x >= 0 && x <= 1)) {
    return { error: 'Enter probabilities P(A) and P(B) between 0 and 1.' };
  }

  let result;
  let formula;
  if (mutuallyExclusive) {
    result = a + b;
    formula = 'P(A ∪ B) = P(A) + P(B)';
  } else {
    if (!Number.isFinite(ab) || ab < 0 || ab > 1) {
      return { error: 'Enter P(A ∩ B) between 0 and 1 for non-mutually exclusive events.' };
    }
    result = a + b - ab;
    formula = 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)';
  }

  if (result > 1 + 1e-9) {
    return { error: 'Computed probability exceeds 1 — check your inputs.' };
  }

  return {
    pA: a,
    pB: b,
    pIntersection: mutuallyExclusive ? 0 : ab,
    mutuallyExclusive,
    result,
    formula,
    steps: [
      { step: 1, title: 'Union formula', content: formula },
      {
        step: 2,
        title: 'Substitute',
        content: mutuallyExclusive
          ? `P(A ∪ B) = ${formatNum(a, 6)} + ${formatNum(b, 6)} = ${formatNum(result, 6)}`
          : `P(A ∪ B) = ${formatNum(a, 6)} + ${formatNum(b, 6)} − ${formatNum(ab, 6)} = ${formatNum(result, 6)}`,
      },
    ],
  };
}

/** P(A|B) = P(A∩B) / P(B) */
export function computeConditionalProbability(pAB, pGiven) {
  const ab = Number(pAB);
  const given = Number(pGiven);
  if (![ab, given].every((x) => Number.isFinite(x) && x >= 0)) {
    return { error: 'Enter valid non-negative probabilities.' };
  }
  if (given === 0) {
    return { error: 'P(B) or P(A) in the denominator cannot be zero.' };
  }

  const result = ab / given;

  return {
    pAB: ab,
    pGiven: given,
    result,
    steps: [
      {
        step: 1,
        title: 'Conditional probability',
        content: 'P(A|B) = P(A ∩ B) / P(B)   or   P(B|A) = P(A ∩ B) / P(A)',
      },
      {
        step: 2,
        title: 'Substitute',
        content: `Result = ${formatNum(ab, 6)} / ${formatNum(given, 6)} = ${formatNum(result, 6)}`,
      },
    ],
  };
}

/** P(A∩B) = P(A)P(B|A) or P(B)P(A|B) */
export function computeIndependentMultiplication(pA, pBGivenA, mode = 'forward') {
  const first = Number(pA);
  const second = Number(pBGivenA);
  if (![first, second].every((x) => Number.isFinite(x) && x >= 0 && x <= 1)) {
    return { error: 'Enter probabilities between 0 and 1.' };
  }

  const result = first * second;
  const formula =
    mode === 'forward'
      ? 'P(A ∩ B) = P(A) × P(B|A)'
      : 'P(A ∩ B) = P(B) × P(A|B)';

  return {
    pA: first,
    pConditional: second,
    result,
    formula,
    independentNote:
      'If A and B are independent, P(B|A) = P(B) and P(A ∩ B) = P(A) × P(B).',
    steps: [
      { step: 1, title: 'Multiplication rule', content: formula },
      {
        step: 2,
        title: 'Substitute',
        content: `P(A ∩ B) = ${formatNum(first, 6)} × ${formatNum(second, 6)} = ${formatNum(result, 6)}`,
      },
    ],
  };
}
