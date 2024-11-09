import DroppableWrapper from "./DroppableWrapper";
import React, { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import SortableItem from "./SortableItem";
import Submit from "./Submit";
import WordBank from "./WordBank";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { Global } from "@emotion/react";
import { Item } from "./Item";
import PropTypes from "prop-types";
import { WORD_BANK } from "../../utils";
import shuffle from "lodash/shuffle";
import debounce from "lodash/debounce";

export default function Dnd({
  children,
  dragWords = [],
  title,
  successMessage = "Nicely done!",
  failureMessage = "Incorrect anwser."
}) {
  const [activeId, setActiveId] = useImmer(null);

  const [initialItems, childrenWithBlanks] = useMemo(
    () => parseItemsFromChildren(children, dragWords),
    [children, dragWords]
  );

  // keys in `items` are the ids of the blanks/DroppableWrappers
  const [items, setItems] = useImmer(initialItems);

  // find the blank/DroppableWrapper that an item is in
  const findContainer = (id) =>
    (id in items) ? id : Object.keys(items).find((key) => items[key].items.includes(id));

  const onDragStart = ({ active }) => setActiveId(active.id);

  const onDragEnd = ({ active, over }) => {
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over?.id);
    if (!activeContainer || !overContainer) return setActiveId(null);

    setItems((draft) => {
      const activeItems = draft[activeContainer].items;
      const overItems = draft[overContainer].items;

      if (activeContainer !== overContainer) {
        if (overContainer === WORD_BANK) {
          activeItems.length = 0;
          overItems.push(active.id);
        } else {
          activeItems.splice(activeItems.indexOf(active.id), 1);
          if (overItems.length) activeItems.push(...overItems);
          overItems[0] = active.id;
        }
      } else {
        const [from, to] = [activeItems.indexOf(active.id), overItems.indexOf(over?.id)];
        if (from !== to) overItems.splice(to, 0, overItems.splice(from, 1)[0]);
      }

      draft[activeContainer].isCorrect = null;
      draft[overContainer].isCorrect = null;
    });

    setActiveId(null);
  };

  const onChange = useCallback(
    debounce((e, id) => {
      onDragEnd({
        active: { id: e?.target.value },
        over: { id }
      });
    }, 300),
    []
  );

  const onDragCancel = () => setActiveId(null);

  return (
    <div className="p-5">
      <div className="flex justify-center p-3">
        <div>{title}</div>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div>
          {childrenWithBlanks.map((child, index) => {
            const { solutions, id } = child;
            // need a blank for children that have a 'solution'
            if (solutions) {
              const { items: blankItems, isCorrect: isBlankCorrect } = items[id];
              return (
                <DroppableWrapper
                  key={id}
                  id={id}
                  items={blankItems}
                  isCorrect={isBlankCorrect}
                  onChange={(e) => onChange(e, id)}
                >
                  {blankItems.map((value) => {
                    return (
                      <SortableItem
                        key={`sortable-item--${value}`}
                        id={value}
                        isCorrect={isBlankCorrect}
                        color={items[WORD_BANK].colors}
                      />
                    );
                  })}
                </DroppableWrapper>
              );
            }
            return <>{child}</>;
          })}
          <WordBank items={items} />
        </div>
        <DragOverlay>
          {activeId && (
            <>
              <Global styles={{ body: { cursor: "grabbing" } }} />
              <Item value={activeId} color={items[WORD_BANK].colors} dragOverlay />
            </>
          )}
        </DragOverlay>
        <Submit
          items={items}
          failureMessage={failureMessage}
          successMessage={successMessage}
          setItems={setItems}
          initialItems={initialItems}
        />
      </DndContext>
    </div>
  );
}

Dnd.propTypes = {
  children: PropTypes.node,
  dragWords: PropTypes.array,
  successMessage: PropTypes.string,
  title: PropTypes.string,
  failureMessage: PropTypes.string,
  items: PropTypes.object
};

const parseItemsFromChildren = (children, dragWords) => {
  const childrenWithBlanks = children.flatMap(([text, blank]) =>
    blank.props?.solution ? [
      text,
      {
        id: `blank-${blank.key}`,
        isCorrect: null,
        items: [],
        solutions: [blank.props.solution],
      },
    ] : [text]);

  const blanks = childrenWithBlanks.reduce((acc, curr) =>
    curr.solutions ? {
      ...acc,
      [curr.id]: curr
    } : acc, {});

  blanks[WORD_BANK] = {
    items: shuffle(dragWords.map(i => i.word)),
    colors: dragWords.reduce((acc, item) => {
      acc[item.word] = item;
      return acc;
    }, {})
  };

  return [blanks, childrenWithBlanks];
};