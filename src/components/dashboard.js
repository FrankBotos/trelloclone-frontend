import NavBar from "./navbar";
import GetAllKanbans from "../data/getAllKanbans";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/usercontext";

import CreateKanban from "../data/createKanban";

export default function DashBoard(token){

    const { userC, setUserC } = useContext(UserContext);

    const [myKanbans, setMyKanbans] = useState(null);
    const [activeKanban, setActiveKanban] = useState(null);

    const [createHidden, setCreateHidden] = useState(true);
    const [createdKanbanTitle, setCreatedKanbanTitle] = useState("");

    useEffect(() => {
        if (token && userC.name != null){
            const data = GetAllKanbans()
            .then((retrievedKanbans)=>{
                
                setMyKanbans(retrievedKanbans);//for confirming that kanbans were successfully retrieved

                var temp = userC;
                temp.myKanbans = retrievedKanbans;
                setUserC(temp);

            });
        }

        

    }, [token]);

    

    if (userC.myKanbans){
        return <div>
        <NavBar/>

        <div>

        <div
          onClick={() => {
            setCreateHidden(false);
          }}
          className="md:inline py-5"
        >
          -New Kanban
        </div>
        <div className="md:inline py-5">-Rename Kanban</div>
        <div className="md:inline py-5">-Delete Active Kanban</div>
        
      </div>

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
              type="button"
              onClick={ () => {
                var uid = userC.id;
                CreateKanban(createdKanbanTitle, uid);
                
                  var temp = userC;

                  //if backend successfully created the board, then update context
                  temp.myKanbans.push({
                    
                    "data":{
                    "uid": uid,
                    "title": createdKanbanTitle,
                    "archived": false,
                    "columns": null,
                    "items": null
                    }

                  });


                  
                 //this block is used to access the nested "postuserid" array and update state
                setUserC((prevState) => ({
                ...prevState,
                data: {
                ...prevState,
                data: temp,
                },
                }));
                console.log(userC);
    
                  

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
        
        <div className="grid grid-cols-5">
            <div className="col-span-1 bg-red-50">
                <div className="font-bold text-md">Your Kanban Boards</div>
                {userC.myKanbans.map((board)=>{
                    return <div>{board.data.title}</div>
                })}
            </div>
            <div className="col-span-4 bg-red-100">
                {
                    activeKanban ? 
                    <div>{activeKanban.data.title}</div>
                    :
                    <div>Please select a board to start working!</div>
                }
            </div>
        </div>
        

    </div>
    }
    
}