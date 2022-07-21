//initial boilerplate/tutorial code for kanban board from "LogRocket":
//https://codesandbox.io/s/jovial-leakey-i0ex5?file=/src/App.js
//https://www.youtube.com/watch?v=Vqa9NMzF3wc&ab_channel=LogRocket

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import UpdateKanbanColumns from "../data/updateKanbanColumns";

import { PlusCircleIcon, TrashIcon, EyeIcon } from '@heroicons/react/outline';

export default function KanbanBoard(board) {
  const OnDragEnd = (result, columns, setColumns, boardId) => {
    if (result.reason === "CREATE") {
      const column = columns[1];
      const copiedItems = [...column.items];
      copiedItems.unshift(result.task);
      setColumns({
        ...columns,
        [1]: {
          ...column,
          items: copiedItems,
        },
      });

      /*crucial to update the intitial board as well, since it will work with context to keep state throughout app*/
      board.board.data.columns[1].items.unshift(result.task);

      return;
    }

    if (result.reason === "DELETE") {
      const column = columns[result.droppableId];
      const copiedItems = [...column.items];

      copiedItems.splice(result.taskIndex, 1);

      setColumns({
        ...columns,
        [result.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });

      //updating board to reflect drag and drop state
      var tempboard = board.board.data.columns[result.droppableId].items.filter(
        (item) => item.id !== result.draggableId
      );
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
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      //updating board to reflect the drag and drop state after an item is moved
      var tempboard = board.board.data.columns;
      var boardSource =
        tempboard[result.source.droppableId].items[result.source.index];
      var colAfterRemove = tempboard[result.source.droppableId].items.filter(
        (item) => item !== boardSource
      );
      tempboard[result.source.droppableId].items = colAfterRemove;
      tempboard[result.destination.droppableId].items[
        result.destination.index
      ] = boardSource;
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
          items: copiedItems,
        },
      });
    }
  };

  //syncs board with database
  const SyncBoard = (id, cols) => {
    UpdateKanbanColumns(id, cols);
  };

  useEffect(() => {
    //no need to sync on initial load, as we are passing complete board
    setColumns(board.board.data.columns);
  }, [board]);

  const [columns, setColumns] = useState(board.board.data.columns);

  const [newItemHidden, setNewItemHidden] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const [modalHidden, setModalHidden] = useState(true);
  const [modalContent, setModalContent] = useState("INIT CONTENT");

  useEffect(() => {
    SyncBoard(board.board.id, columns);
  }, [columns]);

  return (
    <div>

      {/*simple dynamic modal to display task details*/}
      <div
        className={`transition-all duration-500 ${modalHidden ? "opacity-0 invisible" : "opacity-100 visible"} z-10 absolute top-0 left-0 w-screen h-screen bg-slate-500 bg-opacity-50 backdrop-blur-sm`}
      >
        <div className="opacity-100 w-2/4 h-1/3 mx-auto my-24 rounded-xl bg-slate-50 z-20">

          <div className="relative h-full w-full">

            <div className="absolute top-8 right-4 h-24 w-24 text-2xl font-extrabold">
            <button className="text-slate-800 hover:text-slate-500" onClick={()=>setModalHidden(true)}>X</button>
            </div>
            <div className="p-12">

              <div className="text-xl font-bold">Viewing Task: 
                <div className="inline text-xl font-semibold">
                  {" " + modalContent.content}
                </div>
              </div>

              <div className="text-lg font-bold my-24">Details: 
                <div className="inline text-md font-semibold">
                  {modalContent.details === "" ? " No details provided" : " " + modalContent.details}
                </div>
              </div>
              

            </div>
             
          </div>
                
        </div>
      </div>

      <div className="text-2xl font-semibold m-4">
        Working On:
        <span className="text-3xl font-bold">"{board.board.data.title}"</span>
      </div>

      <div
        className="bg-purple-700 w-48 p-2 mx-auto rounded text-slate-100 text-sm font-semibold cursor-pointer hover:bg-purple-800"
        onClick={() => {
          setNewItemHidden(false);
        }}
      >
        <PlusCircleIcon className="inline w-5 h-5" />
        <div className="inline mx-2">New Task</div>
      </div>

      {/*form for new task*/}
      <div
        hidden={newItemHidden}
        className="bg-blue-50 p-4 m-4 w-2/5 mx-auto rounded"
      >
        <form>
          <div className="w-4/5 items-center py-2 mx-auto">
            <div className="font-semibold text-lg">Title:</div>
            <input
              className="appearance-none bg-white rounded-xl border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Item Title"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />

            <div className="font-semibold text-lg pt-4">
              Details (optional):
            </div>
            <textarea 
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            className="h-32 resize-y appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

            <button
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm text-white font-semibold py-1 px-2 rounded disabled:bg-slate-500 disabled:text-slate-300"
              type="submit"
              disabled={newItemTitle === ""}
              onClick={(e) => {
                e.preventDefault();

                var task = {
                  id: JSON.stringify(Date.now()),
                  content: newItemTitle,
                  details: newDetails,
                };

                OnDragEnd(
                  {
                    reason: "CREATE",
                    task: task,
                  },
                  columns,
                  setColumns,
                  board.board.id
                );

                setNewItemHidden(true);
                setNewItemTitle("");
                setNewDetails("");

                SyncBoard(board.board.id, columns);
              }}
            >
              Create
            </button>

            <button
              className="flex-shrink-0 border-transparent border-4 text-slate-700 hover:text-slate-800 text-sm py-1 px-2 rounded font-semibold"
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

      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => {
            OnDragEnd(result, columns, setColumns, board.board.id);
            SyncBoard(board.board.id, columns);
          }}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <div className="text-2xl mt-4 text-slate-700">
                  {column.name}
                </div>

                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e2e8f0"
                              : "#f5f3ff",
                            padding: 4,
                            minHeight: 500,
                          }}
                          className="rounded-xl sm:w-48 md:w-96"
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
                                        ...provided.draggableProps.style,
                                      }}
                                      className="rounded-xl border border-indigo-600 text-sm"
                                    >
                                      <div className="font-semibold">
                                        {item.content}
                                      </div>

                                      <div className="pt-5">
                                        <button
                                          className="border border-slate-500 bg-slate-300 text-slate-500 rounded text-sm font-semibold mx-4 hover:bg-slate-400 p-0.5"
                                          onClick={() => {
                                            setModalHidden(false);
                                            setModalContent(item);
                                          }}
                                        >
                                          <EyeIcon className=" inline h-4 w-4 text-slate-700" />
                                        </button>

                                        <button
                                          className="border border-slate-500 bg-slate-300 text-slate-500 rounded text-sm font-semibold mx-4 hover:bg-slate-400 p-0.5"
                                          onClick={() => {
                                            OnDragEnd(
                                              {
                                                reason: "DELETE",
                                                draggableId: item.id,
                                                droppableId: columnId,
                                                taskIndex: index,
                                              },
                                              columns,
                                              setColumns,
                                              board.board.id
                                            );

                                            SyncBoard(board.board.id, columns);
                                          }}
                                        >
                                          <TrashIcon className=" inline h-4 w-4 text-slate-700" />
                                        </button>
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
