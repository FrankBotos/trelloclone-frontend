import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/usercontext";

import NavBar from "./navbar";
import GetAllKanbans from "../data/getAllKanbans";
import KanbanBoard from "./kanbanboard";



import CreateKanban from "../data/createKanban";
import DeleteKanban from "../data/deleteKanban";
import UpdateKanban from "../data/updateKanban";

export default function DashBoard(token){

    const { userC, setUserC } = useContext(UserContext);

    const [myKanbans, setMyKanbans] = useState(null);
    const [activeKanban, setActiveKanban] = useState(null);
    const [activeKanbanID, setActiveKanbanID] = useState(null);

    const [createHidden, setCreateHidden] = useState(true);
    const [createdKanbanTitle, setCreatedKanbanTitle] = useState("");

    const [renameHidden, setRenameHidden] = useState(true);
    const [renamedKanbanTitle, setRenamedKanbanTitle] = useState("");

    useEffect(() => {
        if (token && userC.name != null){
          getKanbansAndSetContext();
        }
    }, [token]);

    //if selectMostRecent is true, we will activate the most recent board
    const getKanbansAndSetContext = (selectMostRecent) => {
      GetAllKanbans()
            .then((retrievedKanbans)=>{
                setMyKanbans(retrievedKanbans);
                var temp = userC;
                temp.myKanbans = retrievedKanbans;

                //sort by date upon retrieval
                temp.myKanbans.sort(function(a,b){
                  return new Date(b.data.created) - new Date(a.data.created);
                })

                //TODO:filter out all boards made by other users 

                setUserC(temp);

                if (selectMostRecent) {
                  setActiveKanban(userC.myKanbans[0])
                  setActiveKanbanID(userC.myKanbans[0].id)
                }

            });
    }
  

    if (userC.myKanbans){
        return <div>
        <NavBar/>

        <div>
          

        <div
          onClick={() => {
            setCreateHidden(false);
            setRenameHidden(true);
          }}
          className="md:inline py-5"
        >
          -New Kanban
        </div>
        <div className="md:inline py-5"
        onClick={()=>{
          if (activeKanban){
            setRenameHidden(false);
            setCreateHidden(true);
          } else {
            console.error("No active board selected!");
          }

        }}
        >-Rename Kanban</div>

        <div className="md:inline py-5" 
        onClick={()=>{

          DeleteKanban(activeKanban.id);
          setActiveKanban(null);
          getKanbansAndSetContext();
          
          
        
        }}>-Delete Active Kanban</div>
        
      </div>

      {/*dropdown form for new board name*/}
      <div
        className="z-40 bg-blue-100 w-3/5 mx-auto rounded m-4"
        hidden={createHidden}
      >
        <div>Please name your new Kanban Board</div>
        <form className="w-4/5 mx-auto">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Board Title"
              value={createdKanbanTitle}
              onChange={(e) => setCreatedKanbanTitle(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
              onClick={ (e) => {
                e.preventDefault();
                var uid = userC.id;
                CreateKanban(createdKanbanTitle, uid, new Date());


                  //on create, refresh all boards from back-end to ensure there is "id" property on all items
                  //passing in "true" to signifiy that we want to set our activeKanban to the most recently created board
                  getKanbansAndSetContext(true);

                  

                  setCreateHidden(true);
                  setCreatedKanbanTitle("");

                  
              
              }
            }
            >
              Create
            </button>

            <button
              className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
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
        className="z-40 bg-blue-100 w-3/5 mx-auto rounded m-4"
        hidden={renameHidden}
      >
        <div>Please enter a new title</div>
        <form className="w-4/5 mx-auto">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Board Title"
              value={renamedKanbanTitle}
              onChange={(e) => setRenamedKanbanTitle(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
              onClick={ (e) => {
                e.preventDefault();
                activeKanban.data.title = renamedKanbanTitle;
                UpdateKanban(activeKanban);

                  //on create, refresh all boards from back-end to ensure there is "id" property on all items
                  //passing in "true" to signifiy that we want to set our activeKanban to the most recently created board
                  getKanbansAndSetContext(true);
                  
                  setRenameHidden(true);
                  setRenamedKanbanTitle("");

                  
              
              }
            }
            >
              Create
            </button>

            <button
              className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
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


        
        <div className="grid grid-cols-5">
            <div className="col-span-1 bg-red-50">
                <div className="font-bold text-md">Your Kanban Boards</div>
                {userC.myKanbans.map((board)=>{

                    return <div 
                    onClick={()=>{
                      getKanbansAndSetContext();
                      setActiveKanban(board);
                      setActiveKanbanID(board.id);
                    }}
                    className={
                      activeKanbanID == board.id ?
                      "font-bold"
                      :
                      "font-normal"
                    }
                    >{board.data.title}</div>

                })}
            </div>
            <div className="col-span-4 bg-red-100">
                {
                    activeKanban ? 
                    <div><KanbanBoard board={activeKanban}/></div>
                    :
                    <div>Please select a board to start working!</div>
                }
            </div>
        </div>
        

    </div>
    }
    
}