import { users } from '@data/static.json';

export default function UserPicker() {
  return (
    <select>
     {users.map(u => (
        <option key={u.id}>{u.name}</option>
      ))}
    </select>
  );
}
