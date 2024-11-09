import PropTypes from "prop-types";
import React, { useState, useMemo } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { WORD_BANK, getCorrectAnswers } from "../../utils";
import { useConfetti } from "../../hooks/useConfetti";

export default function Buttons({
  items,
  initialItems,
  setItems,
  failureMessage,
  successMessage,
}) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [submitButtonRef, confetti] = useConfetti();

  const allBlanksEmpty = useMemo(
    () => !Object.entries(items).some(([key, value]) => key !== WORD_BANK && value.items.length),
    [items]
  );

  const handleCheckAnswers = () => {
    let correct = true;

    const updatedBlanks = Object.entries(items).reduce((acc, [key, value]) => {
      const isBlankCorrect = key !== WORD_BANK && value.items.some((item) => value.solutions.includes(item));
      acc[key] = { ...value, isCorrect: isBlankCorrect || null };
      if (!isBlankCorrect && key !== WORD_BANK) correct = false;
      return acc;
    }, {});

    setIsCorrect(correct);
    setItems(updatedBlanks);
    setAttemptCount((prev) => (correct ? 0 : prev + 1)); // Reset attempts on correct answer
    if (correct) confetti();
  };

  const handleReset = () => {
    setItems(initialItems);
    setIsCorrect(false);
    setAttemptCount(0);
  };

  const handleShowSolution = () => {
    setItems(getCorrectAnswers(items));
    setIsCorrect(true);
  };

  return (
    <>
      <div className="flex items-center gap-2.5 mt-4">
        <SubmitButton
          disabled={allBlanksEmpty || isCorrect}
          onClick={handleCheckAnswers}
          ref={submitButtonRef}
        />

        {(attemptCount > 0) && (
          <ResetButton onClick={handleReset} />
        )}

        {attemptCount >= 3 && !isCorrect && (
          <ShowSolutionButton onClick={handleShowSolution} />
        )}
      </div>

      {((attemptCount > 0) || isCorrect) && <FeedbackMessage
        isCorrect={isCorrect}
        successMessage={successMessage}
        failureMessage={failureMessage}
        isShowSolution={attemptCount >= 3}
      />}
    </>
  );
}

Buttons.propTypes = {
  successMessage: PropTypes.string.isRequired,
  failureMessage: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  initialItems: PropTypes.object.isRequired,
  setItems: PropTypes.func.isRequired,
};

// Sub-components within the same file
const SubmitButton = React.forwardRef(({ disabled, onClick }, ref) => (
  <button
    className="px-4 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={disabled}
    onClick={onClick}
    ref={ref}
  >
    Submit
  </button>
));

SubmitButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ResetButton = ({ onClick }) => (
  <button
    className="flex items-center gap-2.5 px-4 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
    onClick={onClick}
  >
    Reset
    <FiRotateCcw />
  </button>
);

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ShowSolutionButton = ({ onClick }) => (
  <button
    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
    onClick={onClick}
  >
    Show solution
  </button>
);

ShowSolutionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const FeedbackMessage = ({ isCorrect, successMessage, failureMessage, isShowSolution }) => (
  <div className={`mt-4 flex items-start p-4 rounded-lg ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
    <div className="mr-3">
      <span className={isCorrect ? "text-green-600" : "text-red-600"}>
        {isCorrect ? "✔️" : "❗"}
      </span>
    </div>
    <div>
      <strong className={isCorrect ? "text-green-700" : "text-red-700"}>
        {isCorrect ? (isShowSolution ? "See correct answer above" : "Correct.") : "Try again."}
      </strong>
      <span className="text-gray-700">
        {isCorrect ? (isShowSolution ? "" : successMessage) : failureMessage}
      </span>
    </div>
  </div>
);

FeedbackMessage.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  successMessage: PropTypes.string.isRequired,
  failureMessage: PropTypes.string.isRequired,
  isShowSolution: PropTypes.number
};
