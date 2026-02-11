import { useContext, useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalMovies: 0, totalReviews: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats(token);
        setStats(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard stats");
      }
    };
    fetchStats();
  }, [token]);

  return (
    <AdminLayout title="Admin Dashboard">
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="text-sm text-gray-400">Total Movies</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalMovies}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="text-sm text-gray-400">Total Reviews</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalReviews}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
