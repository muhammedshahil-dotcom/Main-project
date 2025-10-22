import { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser } from "../services/UserService";
import { AuthContext } from "../context/AuthContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id, token);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">👥 User List</h1>

      <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              {user?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="px-6 py-3">{u.name}</td>
                <td className="px-6 py-3 text-gray-400">{u.email}</td>
                <td
                  className={`px-6 py-3 ${
                    u.role === "admin" ? "text-green-400" : "text-blue-400"
                  }`}
                >
                  {u.role}
                </td>
                {user?.role === "admin" && (
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
