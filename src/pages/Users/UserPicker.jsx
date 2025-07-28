import { useState } from 'react';
import Spinner from '@/UI/Spinner';
import useUser from '@hooks/useUser';
export default function UserPicker() {
  const users = useUser();

  if (!users) {
    return <Spinner/>
  }

  return (
    <select className="text-gray-50 pl-2 pr-2 rounded-full">
     {users.map(u => (
        <option key={u.id}>{u.name}</option>
      ))}
    </select>
  );
}
