export function calculateEffort(
  category: string
) {

  switch (category) {

    case "sales":
      return 20;

    case "marketing":
      return 40;

    case "operations":
      return 30;

    default:
      return 25;

  }

}