import { useState, useContext } from "react";
import { UserContext } from "../context/usercontext";

import CreateKanban from "../data/createKanban";

export default function NavBar() {
  const { userC, setUserC } = useContext(UserContext);

  const [createHidden, setCreateHidden] = useState(true);

  return (
    <div>
      <div className="rounded-xl bg-slate-100 space-x-9 py-4">
        <div className="md:inline text-3xl">TrelloClone</div>
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
        <div>Active User: {userC.name}</div>
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
              placeholder="Title"
              aria-label="Board Title"
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              onClick={() => {
                CreateKanban();
              }}
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
    </div>
  );
}
