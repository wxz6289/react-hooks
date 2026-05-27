import { createContext, useContext } from 'react';
import useUser from "@hooks/useUser";

const UserContext = createContext({ user: null, setUser: () => {} });

export default UserContext;

export function UserProvider({ children }) {
   const { users, user, setUser, loading, error } = useUser();
  return (
    <UserContext.Provider value={{ user, users, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}