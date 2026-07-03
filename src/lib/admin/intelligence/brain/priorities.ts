export function rankBrainPriorities(
  actions: any[]
) {

  return [...actions]

    .sort(

      (a,b)=>

        b.scoring.finalScore-

        a.scoring.finalScore

    )

    .slice(0,5);

}