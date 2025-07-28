import { useState, useEffect } from 'react';

export default function useUser() {
   const [users, setUsers] = useState([]);
  useEffect(() => {
      async function getUsers() {
        const response = await fetch("http://localhost:3000/users");
        const users = await response.json();
        setUsers(users);
      }
      getUsers();
    }, []);
  return users;
}