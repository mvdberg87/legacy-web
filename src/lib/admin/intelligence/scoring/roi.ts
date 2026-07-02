export function calculateROI(

  impact: number,

  effort: number

) {

  if (effort <= 0) {

    return impact;

  }

  return Math.round(

    impact / effort * 100

  );

}