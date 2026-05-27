import UsersList from './UsersList';
import UserDetails from './UserDetails';
import { useUserContext } from './UserContext';

export default function UsersPage() {
  const { user, users, setUser, loading, error } = useUserContext();

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="users-page">
      <UsersList user={user} users={users} setUser={setUser}/>
      <UserDetails user={user}/>
    </main>
  );
}