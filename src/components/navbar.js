import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/usercontext";



export default function NavBar() {
  const { userC, setUserC } = useContext(UserContext);



  return (
    <div>

      <div className="rounded-xl bg-slate-100 space-x-9 py-4">
        <div className="md:inline text-3xl">TrelloClone</div>
        <div>Active User: {userC.name}</div>
        
        
      </div>
    </div>
  );
}
