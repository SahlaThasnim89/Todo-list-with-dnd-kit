import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon"
import { Column, Id ,Task} from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";


function toDo() {

    const createNewColumn=()=>{
            const columnToAdd:Column={
                id:generateId(),
                title:`Column ${columns.length+1}`
        
            }
            setColumns([...columns,columnToAdd])
          }


          const deleteColumn=(id:Id)=>{
            const filteredColumn=columns.filter((col)=>col.id!==id);
            setColumns(filteredColumn)

            const newTasks=tasks.filter(t=>t.columnId!==id)
            setTasks(newTasks)
        }


        const updateColumn=(id:Id,title:string)=>{
            const newColumns=columns.map(col=>{
                if(col.id!==id)return col;
                return {...col,title}
            })
            setColumns(newColumns)
        }


        const onDragStart=(event:DragStartEvent)=>{
            if(event.active.data.current?.type==='Column'){
                setActiveColumn(event.active.data.current.column);
                return;
            }

            if(event.active.data.current?.type==='Task'){
                setActiveTask(event.active.data.current.task);
                return;
            }
            
        }

        const ondragend=(event:DragEndEvent)=>{
            setActiveColumn(null)
            setActiveTask(null)
            const {active,over}=event;
            if(!over) return;

            const activeId=active.id;
            const overId=over.id;

            if(activeId===overId) return;

            setColumns(columns=>{
                const activeColumnndex=columns.findIndex(col=>col.id===activeId)
                const overColumnIndex=columns.findIndex(col=>col.id===overId)
                return arrayMove(columns,activeColumnndex,overColumnIndex)
            })
        }


        const ondragover=(event:DragOverEvent)=>{
            const {active,over}=event;
            if(!over) return;

            const activeId=active.id;
            const overId=over.id;

            if(activeId===overId) return;

            const isActiveATask=active.data.current?.type==='Task'
            const isOverATask=over.data.current?.type==='Task'

            if(!isActiveATask)return;

            //task over another task
            
            if(isActiveATask && isOverATask){
                setTasks(tasks=>{
                    const activeIndex=tasks.findIndex(t=>t.id===activeId)
                    const overIndex=tasks.findIndex(t=>t.id===overId)

                    tasks[activeIndex].columnId =tasks[overIndex].columnId
                    
                    return arrayMove(tasks,activeIndex,overIndex)
                })
            }

            const isOverAColumn=over.data.current?.type==="Column"

            //task over another column

            if(isActiveATask && isOverAColumn){
                setTasks(tasks=>{
                    const activeIndex=tasks.findIndex(t=>t.id===activeId)
                    tasks[activeIndex].columnId =overId
                    
                    return arrayMove(tasks,activeIndex,activeIndex)
                })
            }


        }


        const createTask=(columnId:Id)=>{
            const newTask:Task={
                id:generateId(),
                columnId,
                content:`Task ${tasks.length+1}`
            }
            setTasks([...tasks,newTask])
        }


        const deleteTask=(id:Id)=>{
            const newTasks=tasks.filter((task)=>task.id !==id)
            setTasks(newTasks)
        }

        const updateTask=(id:Id,content:string)=>{
            const newTasks=tasks.map(task=>{
                if(task.id!==id)return task;
                return {...task,content}
            })
            setTasks(newTasks)
        }



    const[columns,setColumns]=useState<Column[]>([]);
    const columnsId=useMemo(()=>columns.map(col=>col.id),[columns])
    const [activeColumn,setActiveColumn]=useState<Column|null>(null)
    const sensors=useSensors(useSensor(PointerSensor,{
        activationConstraint:{
            distance:3,
        }
    }))

    const [tasks,setTasks]=useState<Task[]>([])
    const [activeTask,setActiveTask]=useState<Task|null>(null)
    
  return (
    <div className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">

<DndContext sensors={sensors} 
        onDragStart={onDragStart} 
        onDragEnd={ondragend}
        onDragOver={ondragover}>
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
            <SortableContext items={columnsId}>
                {columns.map((col)=>(
                <ColumnContainer 
                key={col.id} 
                column={col} 
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(task=>task.columnId===col.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
                />
                ))}
                </SortableContext>
                </div>
        <button onClick={()=>{createNewColumn()}} className="
        h-[60px]
        w-[350px]
        min-w-[350px]
        cursor-pointer
        rounded-lg
        bg-mainBackgroundColor
        border-2
        border-columnBackgroundColor
        p-4
        ring-red-50
        hover:ring-2
        flex
        gap-6">
            <PlusIcon/>
            Add Column</button>
        </div>


               {createPortal( 
                        <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer 
                        column={activeColumn}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        tasks={tasks.filter(task=>task.columnId===activeColumn.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        />
                    )}
                    {activeTask && <TaskCard 
                    task={activeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    />}
                        </DragOverlay>, 
                        document.body           
               )} 


        </DndContext>
    </div>
  );

//   const createNewColumn=()=>{
//     const columnToAdd:Column={
//         id:generateId(),
//         title:`Column ${columns.length+1}`

//     }
//     setColumns([...columns,columnToAdd])
//   }

// const deleteColumn=(id:Id)=>{
//     const filteredColumn=columns.filter((col)=>col.id!==id);
//     setColumns(filteredColumn)
// }
}
const generateId=()=>{
    return Math.floor(Math.random()*10001)
}



export default toDo