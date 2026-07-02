export function calculateUrgency(

  priority: number

) {

  return Math.max(

    0,

    100 - priority * 15

  );

}