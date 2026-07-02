export function calculatePercentile(
  rank: number,
  total: number
) {

  return Math.round(

    (1 - (rank - 1) / total) * 100

  );

}