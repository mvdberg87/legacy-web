export function buildBrainBriefing(

  decisions:any[],

  confidence:number

){

  if(!decisions.length){

    return

    "Er zijn momenteel geen belangrijke acties.";

  }

  return `

Ik heb ${decisions.length} belangrijke acties geselecteerd.

Mijn gemiddelde confidence bedraagt ${confidence}%.

Mijn belangrijkste advies vandaag is:

${decisions[0].title}.

`;

}