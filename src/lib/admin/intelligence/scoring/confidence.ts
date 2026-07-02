export function normalizeConfidence(

  confidence: number

) {

  return Math.min(

    100,

    Math.max(0, confidence)

  );

}