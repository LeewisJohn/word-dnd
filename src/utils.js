// default sortable transition duration -- use in the cypress integration tests
export const SORTABLE_TRANSITION_DURATION = 200;

export const WORD_BANK = "WORD_BANK";

/**
 * Returns a object with blank IDs as keys, and an object as values
 *  Each object has:
 *  - id (the blank's ID)
 *  - isCorrect (boolean indicating if the blank has the correct answer)
 *  - items (an array of strings indicating what is currently in the blank)
 *  - solutions (an array of strings indicating what the correct answers could be for this blank. can have multiple.)
 */
export const getCorrectAnswers = (items) => {
  const entries = Object.entries(items);

  return entries.reduce(
    (acc, [key, value]) =>
      key === WORD_BANK
        ? acc
        : {
          ...acc,
          [key]: {
            ...value,
            isCorrect: true,
            items: value.solutions
          }
        },
    items
  );
};
