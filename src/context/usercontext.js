import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userC, setUserC] = useState({
    id: null,
    name: null,
    myKanbans: []
  });

  return (
    <UserContext.Provider value={{ userC, setUserC }}>
      {children}
    </UserContext.Provider>
  );
};