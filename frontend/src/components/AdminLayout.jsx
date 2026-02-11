import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/movies", label: "Manage Movies" },
  { to: "/admin/reviews", label: "Manage Reviews" },
  { to: "/admin/users", label: "Manage Users" },
];

const AdminLayout = ({ title, children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <aside className="rounded-xl border border-gray-800 bg-gray-900 p-3">
          <h2 className="mb-3 text-lg font-semibold">Admin Panel</h2>
          <nav className="grid gap-1">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-3 py-2 text-sm ${
                  location.pathname === item.to ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h1 className="mb-5 text-2xl font-bold">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
