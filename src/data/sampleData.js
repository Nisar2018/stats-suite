export const meanFrequencyData = [
  { classInterval: '10 – 20', midPoint: 15, frequency: 5, product: 75 },
  { classInterval: '20 – 30', midPoint: 25, frequency: 8, product: 200 },
  { classInterval: '30 – 40', midPoint: 35, frequency: 12, product: 420 },
  { classInterval: '40 – 50', midPoint: 45, frequency: 10, product: 450 },
  { classInterval: '50 – 60', midPoint: 55, frequency: 5, product: 275 },
];

export const modeFrequencyData = [
  { classInterval: '10 – 20', frequency: 5 },
  { classInterval: '20 – 30', frequency: 8 },
  { classInterval: '30 – 40', frequency: 12 },
  { classInterval: '40 – 50', frequency: 10 },
  { classInterval: '50 – 60', frequency: 5 },
];

export const medianFrequencyData = [
  { classInterval: '10 – 20', frequency: 5 },
  { classInterval: '20 – 30', frequency: 8 },
  { classInterval: '30 – 40', frequency: 12 },
  { classInterval: '40 – 50', frequency: 10 },
  { classInterval: '50 – 60', frequency: 5 },
];

export const MODAL_CLASS_INDEX = 2;
export const MEDIAN_CLASS_INDEX = 2;

export function getTotalFrequency(rows) {
  return rows.reduce((sum, row) => sum + row.frequency, 0);
}

export function getTotalProduct(rows) {
  return rows.reduce((sum, row) => sum + (row.product ?? 0), 0);
}
