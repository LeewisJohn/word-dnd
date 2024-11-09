import DroppableWrapper from "./DroppableWrapper";
import PropTypes from "prop-types";
import React from "react";
import SortableItem from "./SortableItem";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { WORD_BANK } from "../../utils";

export default function WordBank({ items }) {
  const { items: ITEMS, colors } = items[WORD_BANK];

  return (
    <div className="mt-2 p-2 border-2 rounded-lg">
      <p>Drag words to the blanks above</p>
      <SortableContext items={ITEMS} strategy={rectSortingStrategy}>
        <DroppableWrapper id={WORD_BANK} items={ITEMS}>
          {ITEMS.map((value) => (
            <SortableItem key={value} id={value} color={colors} />
          ))}
        </DroppableWrapper>
      </SortableContext>
    </div>
  );
}

WordBank.propTypes = {
  items: PropTypes.object.isRequired,
};
