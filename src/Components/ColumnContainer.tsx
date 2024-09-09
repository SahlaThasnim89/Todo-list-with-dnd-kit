import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const {
    column,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-400
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        shadow-md
        flex
        flex-col
        opacity-40
        border-2
        border-bronze-950
        "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    shadow-md
    flex
    flex-col
    "
    >
      {/* column title */}

      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-white
        shadow-md
    text-md
    h-[60px]
    cursor-grab
    rounded-md
    p-3
    font-bold
    border-2
    flex
    items-center
    justify-between
    "
      >
        <div className="flex gap-2">
          <div
            className="flex
       justify-center
       items-center
       bg-slate-300
       px-2
       py-1
       text-sm
       rounded-xl
       "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-white
        focus:border-bronze-950
        border rounded
        shadow-md
        outline-none
        px-2

        "
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>

      </div>
      {/* column task container */}
      <div
        className="flex flex-grow flex-col gap-4 p-2
    overflow-x-hidden overflow-y-auto scrollbar-thin-white overflow-auto"
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* column footer */}
      <button
        className="flex gap-2 
    items-center 
    border-black
    bg-black
    text-white
    border-2 rounded-md p-4 
    hover:bg-white
    hover:text-black 
    hover:text-red-50
    active:bg-black
    active:text-white
    w-auto
    m-2"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
