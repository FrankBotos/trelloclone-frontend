import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/usercontext";

export default function NavBar() {
  const { userC, setUserC } = useContext(UserContext);

  return (
    <div>
      <div className="rounded-xl bg-slate-100 space-x-9 py-4 bg-opacity-50">
        <div className="md:inline text-3xl font-bold text-slate-700">
          TrelloClone
        </div>
        <div className="font-semibold text-slate-700 opacity-80">
          Active User: {userC.name}
        </div>
      </div>
    </div>
  );
}
