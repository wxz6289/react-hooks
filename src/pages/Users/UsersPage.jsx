import { useState, useContext } from 'react';
import UsersList from './UsersList';
import UserDetails from './UserDetails';
import UserContext from './UserContext';
export default function UsersPage() {
  const context = useContext(UserContext);
  console.dir(context, 'context');
  const { user, users, setUser, loading, error } = context;

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