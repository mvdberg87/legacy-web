export function calculateConfidence(
  reasons: number
) {

  return Math.min(

    100,

    60 + reasons * 8

  );

}