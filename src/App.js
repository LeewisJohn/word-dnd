import React, { createContext } from "react";
import Paragraph from "./components/paragraph/Paragraph";

// DATA FROM BACKEND
const defaultQuestion = {
  paragraph: `The sky is [_input] and the grass is [_input]. You should drag the word <span style='color: red;'>green</span> to the correct blank.`,
  blanks: [
    { id: 1, position: 'first', correctAnswer: 'blue', type: 'input' },
    { id: 2, position: 'second', correctAnswer: 'green', type: 'drag' },
  ],
  dragWords: [
    { word: 'blue', color: 'default', id: 1 },
    { word: 'green', color: 'red', id: 2 },
    { word: 'yellow', color: 'default', id: 3 },
    { word: 'red', color: 'default', id: 4 },
    { word: 'black', color: 'black', id: 5 },
  ],
};

// Creating context
export const WordContext = createContext();

export default function App() {
  // REMOVE THOSE LOGIC WHEN IMPLEMENT API
  // Retrieve `question` from localStorage or use defaultQuestion if not available
  const storedQuestion = localStorage.getItem("question");
  const question = storedQuestion ? JSON.parse(storedQuestion) : defaultQuestion;

  // Optionally, save default question to localStorage if not already saved
  if (!storedQuestion) {
    localStorage.setItem("question", JSON.stringify(defaultQuestion));
  }

  return (
    <WordContext.Provider value={question}>
      <Paragraph />
    </WordContext.Provider>
  );
}
