import NavBar from "./navbar";
import GetAllKanbans from "../data/getAllKanbans";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/usercontext";

export default function DashBoard(token){

    const { userC, setUserC } = useContext(UserContext);

    const [myKanbans, setMyKanbans] = useState(null);
    const [activeKanban, setActiveKanban] = useState(null);

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

    }, [token, userC]);

    if (myKanbans){
        return <div>
        <NavBar/>

        <div className="grid grid-cols-5">
            <div className="col-span-1 bg-red-50">
                <div className="font-bold text-md">Your Kanban Boards</div>
                <div>
                    {
                        myKanbans.length != 0 ?
                        myKanbans.map((board)=>{
                            return <div onClick={()=>{setActiveKanban(board)}}>{board.data.title}</div>
                        })
                        :
                        <div>No boards yet!</div>
                    }
                </div>
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