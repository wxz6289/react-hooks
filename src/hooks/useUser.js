import { use } from 'react';
import { useState, useEffect } from 'react';

export default function useUser() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function getUsers() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3000/users");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const usersData = await response.json();

        // 检查组件是否已卸载
        if (!isCancelled) {
          setUsers(usersData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setUsers([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    getUsers();

    // 清理函数
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (users.length > 0 && !user) {
      setUser(users[0]);
    }
  }, [users]);

  return { users, user, setUser, loading, error };
}