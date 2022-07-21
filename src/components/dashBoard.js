import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";

import NavBar from "./navBar";
import GetAllKanbans from "../data/getAllKanbans";
import KanbanBoard from "./kanbanBoard";

import CreateKanban from "../data/createKanban";
import DeleteKanban from "../data/deleteKanban";
import UpdateKanbanTitle from "../data/updateKanbanTitle";

import { PlusCircleIcon, PencilAltIcon, TrashIcon, ViewBoardsIcon } from '@heroicons/react/outline';

export default function DashBoard(token) {
  const { userC, setUserC } = useContext(UserContext);

  const [myKanbans, setMyKanbans] = useState(null);
  const [activeKanban, setActiveKanban] = useState(null);
  const [activeKanbanID, setActiveKanbanID] = useState(null);

  const [createHidden, setCreateHidden] = useState(true);
  const [createdKanbanTitle, setCreatedKanbanTitle] = useState("");

  const [renameHidden, setRenameHidden] = useState(true);
  const [renamedKanbanTitle, setRenamedKanbanTitle] = useState("");

  useEffect(() => {
    if (token && userC.name != null) {
      getKanbansAndSetContext();
    }
  }, [token]);

  //if selectMostRecent is true, we will activate the most recent board
  const getKanbansAndSetContext = (selectMostRecent) => {
    GetAllKanbans().then((retrievedKanbans) => {
      setMyKanbans(retrievedKanbans);
      var temp = userC;
      temp.myKanbans = retrievedKanbans;

      //sort by date upon retrieval
      temp.myKanbans.sort(function (a, b) {
        return new Date(b.data.created) - new Date(a.data.created);
      });

      //filter out all boards made by other users
      var afterFilter = temp.myKanbans.filter(board=>
        board.data.uid === token.token
      )
      temp.myKanbans = afterFilter;
      
      
      setUserC(temp);

      if (selectMostRecent) {
        setActiveKanban(userC.myKanbans[0]);
        setActiveKanbanID(userC.myKanbans[0].id);
      }
    });

    //console.log(userC.myKanbans)
  };

  if (userC.myKanbans) {
    return (
      <div>
        <NavBar />

        <div className="m-8">
          <div
            onClick={() => {
              getKanbansAndSetContext();
              setCreateHidden(false);
              setRenameHidden(true);
            }}
            className="md:inline p-2 m-2 bg-purple-700 text-slate-100 font-semibold rounded cursor-pointer hover:bg-purple-800"
          >
            <PlusCircleIcon className="inline w-5 h-5"/>
            <div className="inline mx-2">New Kanban</div>
          </div>
          <div
            className="md:inline p-2 m-2 bg-purple-700 text-slate-100 font-semibold rounded cursor-pointer hover:bg-purple-800"
            onClick={() => {
              getKanbansAndSetContext();

              if (activeKanban) {
                setRenameHidden(false);
                setCreateHidden(true);
              } else {
                console.error("No active board selected!");
              }
            }}
          >
            <PencilAltIcon className="inline w-5 h-5"/>
            <div className="inline mx-2">Rename Kanban</div>
          </div>

          <div
            className="md:inline p-2 m-2 bg-purple-700 text-slate-100 font-semibold rounded cursor-pointer hover:bg-purple-800"
            onClick={() => {
              DeleteKanban(activeKanban.id).then(() => {
                setActiveKanban(null);
                setActiveKanbanID(null);

                getKanbansAndSetContext();

                setCreateHidden(true);
                setRenameHidden(true);
              });
            }}
          >
            <TrashIcon className="inline w-5 h-5"/>
            <div className="inline mx-2">Delete Kanban</div>
          </div>
        </div>

        {/*dropdown form for new board*/}
        <div
          className="z-40 bg-blue-50 w-2/5 mx-auto rounded m-4"
          hidden={createHidden}
        >
          <div className="py-2 font-semibold text-slate-700">Please name your new Kanban Board</div>
          <form className="w-4/5 mx-auto">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-white rounded-xl border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                aria-label="Board Title"
                value={createdKanbanTitle}
                onChange={(e) => setCreatedKanbanTitle(e.target.value)}
              />
              <button
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm text-white font-semibold py-1 px-2 rounded disabled:bg-slate-500 disabled:text-slate-300"
                type="submit"
                disabled={createdKanbanTitle === ""}
                onClick={(e) => {
                  e.preventDefault();
                  var uid = userC.id;
                  CreateKanban(createdKanbanTitle, uid, new Date()).then(() => {
                    //on create, refresh all boards from back-end to ensure there is "id" property on all items
                    //passing in "true" to signifiy that we want to set our activeKanban to the most recently created board
                    getKanbansAndSetContext(true);
                    setCreateHidden(true);
                    setRenameHidden(true);
                    setCreatedKanbanTitle("");
                  });

                }}
              >
                Create
              </button>

              <button
                className="flex-shrink-0 border-transparent border-4 text-slate-700 hover:text-slate-800 text-sm py-1 px-2 rounded font-semibold"
                type="button"
                onClick={() => {
                  setCreateHidden(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/*dropdown form for updating board name*/}
        <div
          className="z-40 bg-blue-50 w-2/5 mx-auto rounded m-4"
          hidden={renameHidden}
        >
          <div className="py-2 font-semibold text-slate-700">Please enter a new title</div>
          <form className="w-4/5 mx-auto">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-white rounded-xl border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                aria-label="Board Title"
                value={renamedKanbanTitle}
                onChange={(e) => setRenamedKanbanTitle(e.target.value)}
              />
              <button
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm text-white font-semibold py-1 px-2 rounded disabled:bg-slate-500 disabled:text-slate-300"
                type="submit"
                disabled={renamedKanbanTitle === ""}
                onClick={(e) => {
                  e.preventDefault();
                  activeKanban.data.title = renamedKanbanTitle;

                  UpdateKanbanTitle(
                    activeKanban.id,
                    activeKanban.data.title
                  ).then(() => {
                    //refresh all boards from back-end to ensure there is "id" property on all items
                    getKanbansAndSetContext();

                    setRenameHidden(true);
                    setRenamedKanbanTitle("");
                  });
                }}
              >
                Rename
              </button>

              <button
                className="flex-shrink-0 border-transparent border-4 text-slate-700 hover:text-slate-800 text-sm py-1 px-2 rounded font-semibold"
                type="button"
                onClick={() => {
                  setRenameHidden(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-8 rounded-xl">
          <div className="col-span-1 bg-red-50 bg-opacity-50">
            <div className="font-extrabold text-lg my-4">Your Kanban Boards</div>
            {userC.myKanbans.map((board) => {
              return (
                <div
                  onClick={() => {
                    //making sure that we can only click inactive kanbans
                    if (!activeKanban || activeKanban.id !== board.id) {
                      setActiveKanban(board);
                      setActiveKanbanID(board.id);
                      getKanbansAndSetContext();
                    } else {
                      setActiveKanban(null);
                      setActiveKanbanID(null);
                      getKanbansAndSetContext();
                    }

                    //close any open forms on switch
                    setCreateHidden(true);
                    setRenameHidden(true);
                  }}
                  className={
                    activeKanbanID === board.id
                      ? "m-1 p-1 font-extrabold text-md text-slate-700 border-2 border-slate-800 mx-auto rounded-lg bg-fuchsia-100 cursor-pointer"
                      : "m-1 p-1 font-semibold text-md text-slate-700 cursor-pointer hover:bg-fuchsia-50 hover:border-2 border-slate-700 hover:font-extrabold rounded-lg"
                  }
                > 
                    <div className="text-left w-full"><ViewBoardsIcon className="inline w-8 h-8 mr-2"/>{board.data.title}</div>
                </div>
              );
            })}
          </div>
          <div className="col-span-7 bg-red-100 bg-opacity-50">
            {activeKanbanID ? (
              <div>
                <KanbanBoard board={activeKanban} /> 
              </div>
            ) : (
              <div className="my-48 font-semibold text-slate-700">
                Please select a board to start working!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
