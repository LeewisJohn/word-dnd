import PropTypes from "prop-types";
import React from "react";
import { Item } from "./Item";
import { useSortable } from "@dnd-kit/sortable";

const SORTABLE_TRANSITION_DURATION = 250;

export default function SortableItem({ id, isCorrect, color }) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    transform,
    transition
  } = useSortable({
    id,
    transition: {
      duration: SORTABLE_TRANSITION_DURATION,
      easing: "ease"
    }
  });

  return (
    <Item
      ref={setNodeRef}
      value={id}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
      isCorrect={isCorrect}
      color={color}
    />
  );
}

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.bool,
  color: PropTypes.object
};
