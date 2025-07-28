import { use } from 'react';
import {useState, useEffect} from 'react';
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];
function UseStorage() {
  const [selectedUser, setSelectedUser] = useState('');
  useEffect(() => {
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      setSelectedUser(storedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedUser', selectedUser);
  }, [selectedUser]);

  return (
    <select onChange={e => setSelectedUser(e.target.value)} value={selectedUser}>
      {users.map(user => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
   );
}

export default UseStorage;