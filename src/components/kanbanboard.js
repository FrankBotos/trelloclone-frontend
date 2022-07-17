//initial boilerplate/tutorial code for kanban board from "LogRocket":
//https://codesandbox.io/s/jovial-leakey-i0ex5?file=/src/App.js
//https://www.youtube.com/watch?v=Vqa9NMzF3wc&ab_channel=LogRocket

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/usercontext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import UpdateKanbanColumns from "../data/updateKanbanColumns";

const OnDragEnd = (result, columns, setColumns, boardId) => {
  
  if(result.reason == 'CREATE') {
    const column = columns[1];
    const copiedItems = [...column.items];
    copiedItems.unshift(result.task);
    setColumns({
      ...columns,
      [1]: {
        ...column,
        items: copiedItems
      }
    });
    return;
  }

  if(result.reason == 'DELETE') {
    const column = columns[result.droppableId];
    const copiedItems = [...column.items];

    copiedItems.splice(result.taskIndex, 1);

    setColumns({
      ...columns,
      [result.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
    return;
  }

  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

//syncs board with database
const SyncBoard = (id, cols) => {

  UpdateKanbanColumns(id, cols);
  
  console.log("synced board: " + id);
  console.log(cols);

}

export default function KanbanBoard(board) {

  useEffect(()=>{
    //no need to sync on initial load, as we are passing complete board
    setColumns(board.board.data.columns);
  },[board])

  

  const { userC, setUserC } = useContext(UserContext);

  const [columns, setColumns] = useState(board.board.data.columns);
  

  const [newItemHidden, setNewItemHidden] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState("");

  useEffect(()=>{
    SyncBoard(board.board.id, columns);
  },[columns])

  return (
    <div>

      <div className="text-2xl font-semibold">{board.board.data.title}</div>


    <div onClick={()=>{
      setNewItemHidden(false);
    }}>Add New Task</div>


    {/*form for new task*/}
    <div hidden={newItemHidden}>
    <form className="w-4/5 mx-auto">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Item Title"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
              onClick={ (e) => {
                e.preventDefault();


                var task = {id: JSON.stringify(Date.now()), content: newItemTitle}


                //if you copy the state, then update the copied variable, the "DragDropContext" will propogate the changes made to the actual state
                /*
                var tempCols = columns;
                Object.values(tempCols).map(function(val) {
                  if (val.name == "To Do"){
                    val.items.push(task)
                  }
                });*/

                OnDragEnd({
                  reason: "CREATE",
                  task: task
                },columns, setColumns, board.board.id);

                
                
                


                setNewItemHidden(true);
                setNewItemTitle("");
                SyncBoard(board.board.id, columns);
              }
            }
            >
              Create
            </button>

            <button
              className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
              type="button"
              onClick={() => {
                setNewItemHidden(true);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
    </div>


    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}> 

      <DragDropContext
        onDragEnd={result => {OnDragEnd(result, columns, setColumns, board.board.id) 
                              SyncBoard(board.board.id, columns)}}
      >
        

        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >

              

              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >

                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                    <button className="bg-slate-300 rounded text-sm px-2 mx-4"onClick={()=>{
                                      
                                      OnDragEnd({
                                        reason: "DELETE",
                                        draggableId: item.id,
                                        droppableId: columnId,
                                        taskIndex: index
                                      },columns, setColumns, board.board.id);

                                      SyncBoard(board.board.id, columns);
                                      

                                      }}>Delete</button>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
        
      </DragDropContext>
      </div>
    </div>
    
  );
}