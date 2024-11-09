import PropTypes from "prop-types";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppableWrapper({ children, id, items, onChange }) {
  const { over, isOver, setNodeRef } = useDroppable({ id });
  const isOverContainer = isOver || (over && items.includes(over.id));

  return (
    <div ref={setNodeRef} className="inline-block">
      {children.length ? (
        <div className={`p-2 flex-wrap flex gap-2 ${isOverContainer ? 'bg-stone-200 rounded-lg shadow-lg' : ''}`}>
          {children}
        </div>
      ) : (
        <div className="rounded-lg">
          <input
            onChange={onChange}
            type="text"
            placeholder=""
            className={`max-w-20 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isOverContainer ? 'bg-stone-200' : ''}`}
          />
        </div>
      )}
    </div>
  );
}

DroppableWrapper.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func
};
