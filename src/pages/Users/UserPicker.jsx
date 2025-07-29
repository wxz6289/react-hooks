import Spinner from "@/UI/Spinner";

export default function UserPicker({ user, users, setUser, loading }) {
  if (loading || !users || users.length === 0) {
    return <Spinner />;
  }

  const handleSelect = ({ target: { value } }) => {
    const selectedUser = users.find((u) => u.id === value);
    setUser(selectedUser);
  };

  return (
    <select
      className="text-gray-50 pl-2 pr-2 rounded-full"
      onChange={handleSelect}
      value={user?.id}
    >
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))}
    </select>
  );
}
