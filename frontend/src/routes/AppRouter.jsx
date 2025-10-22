import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import UserList from "../pages/UserList";
import AddMovie from "../pages/AddMovie";
import EditMovie from "../pages/EditMovie";



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


                {/* Protected Routes */}
                <Route path="/edit/:id" element={
                    <ProtectedRoute>
                        <EditMovie />
                    </ProtectedRoute>} />
                <Route
                    path="/addmovie"
                    element={
                        <ProtectedRoute>
                            <AddMovie />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UserList />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;