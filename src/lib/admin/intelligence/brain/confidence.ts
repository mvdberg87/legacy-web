export function calculateBrainConfidence(
  decisions:any[]
){

  if(!decisions.length){

    return 0;

  }

  return Math.round(

    decisions.reduce(

      (sum,d)=>

      sum+d.confidence,

      0

    )/

    decisions.length

  );

}