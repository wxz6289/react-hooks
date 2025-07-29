export default function UsersList({ user, users, setUser }) {
  return (
    <>
      <ul className="users items-list-nav">
        {users?.map((u) => (
          <li
            key={u.id}
            className={u.id === user?.id ? "selected" : null}
          >
            <button
              className="btn"
              onClick={() => setUser(u)}
            >
              {u.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}