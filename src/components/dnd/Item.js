import PropTypes from "prop-types";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { FiCheck, FiX } from "react-icons/fi";
import classNames from "classnames";

export const Item = React.memo(
  React.forwardRef(
    (
      {
        dragOverlay,
        dragging,
        listeners,
        style,
        color = {},
        transition,
        transform,
        value,
        isCorrect,
        ...props
      },
      ref
    ) => {
      const containerClass = classNames(
        "border border-gray-300 bg-gray-200 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-300",
        {
          "bg-green-200": isCorrect === true,
          "bg-red-200": isCorrect === false,
        }
      );

      const contentClass = classNames(
        `cursor-grab flex items-center`,
        { "opacity-40": dragging },
        `text-${color[value]?.color}-600`
      );

      return (
        <div
          ref={ref}
          className={containerClass}
          style={{
            ...style,
            transition,
            transform: CSS.Transform.toString(transform),
            touchAction: dragOverlay ? "none" : undefined,
          }}
          {...listeners}
          {...props}
        >
          <span className={contentClass}>
            {value} {isCorrect === true ? <FiCheck /> : isCorrect === false ? <FiX /> : null}
          </span>
        </div>
      );
    }
  )
);

Item.propTypes = {
  dragOverlay: PropTypes.bool,
  dragging: PropTypes.bool,
  listeners: PropTypes.object,
  style: PropTypes.object,
  color: PropTypes.object,
  transition: PropTypes.string,
  transform: PropTypes.object,
  value: PropTypes.string.isRequired,
  isCorrect: PropTypes.bool,
};
