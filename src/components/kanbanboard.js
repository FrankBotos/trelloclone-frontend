//initial boilerplate/tutorial code for kanban board from "LogRocket":
//https://codesandbox.io/s/jovial-leakey-i0ex5?file=/src/App.js
//https://www.youtube.com/watch?v=Vqa9NMzF3wc&ab_channel=LogRocket

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/usercontext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import UpdateKanbanColumns from "../data/updateKanbanColumns";
import GetAllKanbans from "../data/getAllKanbans";

export default function KanbanBoard(board) {
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
    
    /*crucial to update the intitial board as well, since it will work with context to keep state throughout app*/
    board.board.data.columns[1].items.unshift(result.task);

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
    
    //updating board to reflect drag and drop state
    var tempboard = board.board.data.columns[result.droppableId].items.filter(item=>item.id != result.draggableId);
    board.board.data.columns[result.droppableId].items = tempboard;

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


    //updating board to reflect the drag and drop state after an item is moved
    var tempboard = board.board.data.columns;
    var boardSource = tempboard[result.source.droppableId].items[result.source.index];
    var colAfterRemove = tempboard[result.source.droppableId].items.filter(item=>item != boardSource)
    tempboard[result.source.droppableId].items = colAfterRemove;
    tempboard[result.destination.droppableId].items[result.destination.index] = boardSource;
    board.board.data.columns = tempboard;


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
  
  

}



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

      <div className="text-2xl font-semibold m-4">Working On: 
      <span className="text-3xl font-bold">"{board.board.data.title}"</span>
      </div>


    <div className="bg-purple-300 w-48 p-4 mx-auto rounded-lg text-slate-700 text-sm font-semibold" onClick={()=>{
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

              

              <div className="text-2xl mt-4 text-slate-700">{column.name}</div>

              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#dbeafe"
                            : "#f5f3ff",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                        className="rounded-xl"
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
                                        ? "#e0f2fe"
                                        : "#ecfeff",
                                      color: "#334155",
                                      ...provided.draggableProps.style
                                    }}
                                    className="rounded-xl border border-indigo-600"
                                  >
                                    <div className="m-2 font-semibold">{item.content}</div>
                                    
                                    <div>
                                    <button className="border border-slate-500 bg-slate-300 text-slate-500 rounded text-sm font-semibold px-2 mx-4"onClick={()=>{
                                      
                                      OnDragEnd({
                                        reason: "DELETE",
                                        draggableId: item.id,
                                        droppableId: columnId,
                                        taskIndex: index
                                      },columns, setColumns, board.board.id);

                                      SyncBoard(board.board.id, columns);
                                      

                                      }}>X</button>
                                    </div>
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