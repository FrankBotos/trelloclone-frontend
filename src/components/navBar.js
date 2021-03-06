import { useContext } from "react";
import { UserContext } from "../context/userContext";

import { BriefcaseIcon } from "@heroicons/react/outline";

export default function NavBar() {
  const { userC } = useContext(UserContext);

  return (
    <div>
      <div className="rounded-xl bg-slate-100 space-x-9 py-4 bg-opacity-50">
        <div className="md:inline text-3xl font-bold text-slate-700">
        <BriefcaseIcon className="inline w-8 h-8"/>TrelloClone
        </div>
        <div className="font-semibold text-slate-700 opacity-80">
          Active User: {userC.name}
        </div>
      </div>
    </div>
  );
}
