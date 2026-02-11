import { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser } from "../services/UserService";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <AdminLayout title="Manage Users">
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/40">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800/80 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-800 hover:bg-gray-800/40">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="rounded bg-red-600 px-3 py-1 text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-4 text-gray-400">No users found.</p>}
        </div>
      )}
    </AdminLayout>
  );
}

export default UserList;
