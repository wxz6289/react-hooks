import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaDoorOpen, FaUsers } from "react-icons/fa";
import UserPicker from "@pages/Users/UserPicker";
import { useState, useMemo, useEffect } from "react";
import UserContext from "@pages/Users/UserContext";
import useUser from "@hooks/useUser";
import "./App.css";

function App() {
  const { users, user, setUser, loading, error } = useUser();
  const contextValue = useMemo(
    () => ({ user, users, setUser, loading, error }),
    [user, users, setUser, loading, error]
  );

  return (
    <UserContext.Provider value={contextValue}>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/bookings" className="btn btn-header">
                  <FaCalendarAlt />
                  <span>Bookings</span>
                </Link>
              </li>
              <li>
                <Link to="/bookables" className="btn btn-header">
                  <FaDoorOpen />
                  <span>Bookables</span>
                </Link>
              </li>
              <li>
                <Link to="/users" className="btn btn-header">
                  <FaUsers />
                  <span>Users</span>
                </Link>
              </li>
            </ul>
          </nav>
          <UserPicker
            user={user}
            users={users}
            setUser={setUser}
            loading={loading}
          />
        </header>
        <Outlet />
      </div>
    </UserContext.Provider>
  );
}

export default App;
