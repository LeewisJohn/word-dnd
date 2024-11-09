import React, { useContext } from "react";
import Dnd from "../dnd/Dnd";
import PropTypes from "prop-types";
import { WordContext } from "../../App";

export default function Paragraph() {
  const { blanks, paragraph, dragWords } = useContext(WordContext) ?? {};
  const parts = paragraph.split("[_input]");

  return (
    <Dnd
      title="Fill in the blank"
      dragWords={dragWords}
    >
      {parts.map((part, index) => [
        <span dangerouslySetInnerHTML={{ __html: part }} />,
        <div key={index} solution={blanks[index]?.correctAnswer} />
      ])}
    </Dnd>
  );
}

Paragraph.propTypes = {
  question: PropTypes.object,
};
